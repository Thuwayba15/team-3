using Abp.Authorization;
using Abp.Runtime.Session;
using Team3.Configuration.Dto;
using System.Threading.Tasks;

namespace Team3.Configuration;

[AbpAuthorize]
public class ConfigurationAppService : Team3AppServiceBase, IConfigurationAppService
{
    public async Task ChangeUiTheme(ChangeUiThemeInput input)
    {
        await SettingManager.ChangeSettingForUserAsync(AbpSession.ToUserIdentifier(), AppSettingNames.UiTheme, input.Theme);
    }
}
