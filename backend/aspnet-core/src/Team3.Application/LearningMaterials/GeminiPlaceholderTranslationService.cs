using Abp.Dependency;
using System;
using System.Threading.Tasks;

namespace Team3.LearningMaterials;

public class GeminiPlaceholderTranslationService : ITextTranslationService, ITransientDependency
{
    public Task<string> TranslateTextAsync(string text, string sourceLanguageCode, string targetLanguageCode)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return Task.FromResult(text);
        }

        if (string.Equals(sourceLanguageCode, targetLanguageCode, StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(text.Trim());
        }

        var translated = $"[Gemini placeholder {sourceLanguageCode}->{targetLanguageCode}] {text.Trim()}";
        return Task.FromResult(translated);
    }
}
