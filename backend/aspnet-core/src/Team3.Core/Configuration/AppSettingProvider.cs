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
                scopes: SettingScopes.Application)
        };
    }
}
