using Abp.Configuration;
using System.Collections.Generic;

namespace Team3.Configuration;

public class AppSettingProvider : SettingProvider
{
    public override IEnumerable<SettingDefinition> GetSettingDefinitions(SettingDefinitionProviderContext context)
    {
        return new[]
        {
            new SettingDefinition(
                AppSettingNames.UiTheme,
                "red",
                scopes: SettingScopes.Application | SettingScopes.Tenant | SettingScopes.User,
                clientVisibilityProvider: new VisibleSettingClientVisibilityProvider()),

            new SettingDefinition(
                AppSettingNames.GeminiApiKey,
                string.Empty,
                scopes: SettingScopes.Application),

            new SettingDefinition(
                AppSettingNames.GeminiModel,
                "gemini-2.5-flash",
                scopes: SettingScopes.Application),

            new SettingDefinition(
                AppSettingNames.AiTutorGeneralPrompt,
                "You are a supportive tutor for South African learners. Explain clearly, encourage the student, and use the selected lesson context.",
                scopes: SettingScopes.Application),

            new SettingDefinition(
                AppSettingNames.AiTutorLifeSciencesPrompt,
                "For Life Sciences, explain biological processes accurately, use simple step-by-step language, and connect ideas to diagnostics and mastery gaps when relevant.",
                scopes: SettingScopes.Application),

            new SettingDefinition(
                AppSettingNames.AiTutorResponseStyle,
                "supportive-step-by-step",
                scopes: SettingScopes.Application),

            new SettingDefinition(
                AppSettingNames.RecommendationMasteryThreshold,
                "70",
                scopes: SettingScopes.Application),

            new SettingDefinition(
                AppSettingNames.RecommendationRetryLimit,
                "3",
                scopes: SettingScopes.Application)
        };
    }
}
