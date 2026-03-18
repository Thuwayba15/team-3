using Abp.Configuration;
using Abp.Dependency;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Team3.Configuration;

namespace Team3.LearningMaterials;

public class GeminiPlaceholderTranslationService : ITextTranslationService, ITransientDependency
{
    private const string DefaultGeminiModel = "gemini-2.5-flash";

    private static readonly HttpClient GeminiHttpClient = new()
    {
        BaseAddress = new Uri("https://generativelanguage.googleapis.com/"),
        Timeout = TimeSpan.FromSeconds(120)
    };

    private static readonly IReadOnlyDictionary<string, string> LanguageNames = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        ["en"] = "English",
        ["zu"] = "isiZulu",
        ["st"] = "Sesotho",
        ["af"] = "Afrikaans"
    };

    private readonly ISettingManager _settingManager;

    public GeminiPlaceholderTranslationService(ISettingManager settingManager)
    {
        _settingManager = settingManager;
    }

    public async Task<string> TranslateTextAsync(string text, string sourceLanguageCode, string targetLanguageCode)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return text;
        }

        if (string.Equals(sourceLanguageCode, targetLanguageCode, StringComparison.OrdinalIgnoreCase))
        {
            return text.Trim();
        }

        var apiKey = await ResolveGeminiApiKeyAsync();
        var model = await ResolveGeminiModelAsync();
        var prompt = BuildTranslationPrompt(text.Trim(), sourceLanguageCode, targetLanguageCode);

        var requestPayload = JsonSerializer.Serialize(new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.1
            }
        });

        var endpoint = $"v1beta/models/{Uri.EscapeDataString(model)}:generateContent?key={Uri.EscapeDataString(apiKey)}";
        using var request = new HttpRequestMessage(HttpMethod.Post, endpoint)
        {
            Content = new StringContent(requestPayload, Encoding.UTF8, "application/json")
        };

        using var response = await GeminiHttpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new UserFriendlyException(
                $"Gemini translation failed ({(int)response.StatusCode}). {ExtractGeminiErrorMessage(responseBody)}");
        }

        var translatedText = ExtractTranslatedText(responseBody);
        if (string.IsNullOrWhiteSpace(translatedText))
        {
            throw new UserFriendlyException("Gemini translation failed: no translated text was returned.");
        }

        return translatedText.Trim();
    }

    private async Task<string> ResolveGeminiApiKeyAsync()
    {
        var apiKey = await _settingManager.GetSettingValueForApplicationAsync(AppSettingNames.GeminiApiKey);
        if (!string.IsNullOrWhiteSpace(apiKey))
        {
            return apiKey.Trim();
        }

        apiKey = Environment.GetEnvironmentVariable("GEMINI_API_KEY");
        if (!string.IsNullOrWhiteSpace(apiKey))
        {
        }

        return "YouCanHardCodeApiKeyHere";


        //throw new UserFriendlyException(
           // $"Gemini API key is not configured. Set '{AppSettingNames.GeminiApiKey}' or the GEMINI_API_KEY environment variable.");
    }

    private async Task<string> ResolveGeminiModelAsync()
    {
        var configuredModel = await _settingManager.GetSettingValueForApplicationAsync(AppSettingNames.GeminiModel);
        if (!string.IsNullOrWhiteSpace(configuredModel))
        {
            return configuredModel.Trim();
        }

        var environmentModel = Environment.GetEnvironmentVariable("GEMINI_MODEL");
        if (!string.IsNullOrWhiteSpace(environmentModel))
        {
            return environmentModel.Trim();
        }

        return DefaultGeminiModel;
    }

    private static string BuildTranslationPrompt(string text, string sourceLanguageCode, string targetLanguageCode)
    {
        var sourceLanguageName = GetLanguageDisplayName(sourceLanguageCode);
        var targetLanguageName = GetLanguageDisplayName(targetLanguageCode);

        return $"""
            Translate the following educational lesson text from {sourceLanguageName} ({sourceLanguageCode}) to {targetLanguageName} ({targetLanguageCode}).

            Rules:
            - Return only the translated text.
            - Preserve line breaks, bullet points, markdown, and numbering.
            - Keep formulas, numbers, and proper nouns unchanged where appropriate.
            - Do not add commentary or notes.

            Text:
            {text}
            """;
    }

    private static string GetLanguageDisplayName(string languageCode)
    {
        if (LanguageNames.TryGetValue(languageCode, out var languageName))
        {
            return languageName;
        }

        return languageCode.Trim().ToLowerInvariant();
    }

    private static string ExtractTranslatedText(string responseBody)
    {
        try
        {
            using var document = JsonDocument.Parse(responseBody);
            if (!document.RootElement.TryGetProperty("candidates", out var candidates) ||
                candidates.ValueKind != JsonValueKind.Array)
            {
                return string.Empty;
            }

            foreach (var candidate in candidates.EnumerateArray())
            {
                if (!candidate.TryGetProperty("content", out var content) ||
                    !content.TryGetProperty("parts", out var parts) ||
                    parts.ValueKind != JsonValueKind.Array)
                {
                    continue;
                }

                foreach (var part in parts.EnumerateArray())
                {
                    if (part.TryGetProperty("text", out var textElement))
                    {
                        var translatedText = textElement.GetString();
                        if (!string.IsNullOrWhiteSpace(translatedText))
                        {
                            return translatedText;
                        }
                    }
                }
            }

            return string.Empty;
        }
        catch
        {
            return string.Empty;
        }
    }

    private static string ExtractGeminiErrorMessage(string responseBody)
    {
        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return "No additional details returned by Gemini.";
        }

        try
        {
            using var document = JsonDocument.Parse(responseBody);
            if (document.RootElement.TryGetProperty("error", out var errorElement) &&
                errorElement.TryGetProperty("message", out var messageElement))
            {
                var message = messageElement.GetString();
                return string.IsNullOrWhiteSpace(message)
                    ? "Gemini returned an error without a message."
                    : message;
            }
        }
        catch
        {
            // ignored
        }

        return "Gemini returned an error without a parsable message.";
    }
}
