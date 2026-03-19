using Abp.Authorization;
using Abp.Configuration;
using System.Threading.Tasks;
using Team3.Authorization;
using Team3.Configuration;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials;

[AbpAuthorize(PermissionNames.Pages_Admin_Prompts)]
public class PromptConfigurationAppService : Team3AppServiceBase
{
    public async Task<PromptConfigurationDto> GetAsync()
    {
        return new PromptConfigurationDto
        {
            GeneralPrompt = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorGeneralPrompt),
            LifeSciencesPrompt = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorLifeSciencesPrompt),
            ResponseStyle = await SettingManager.GetSettingValueAsync(AppSettingNames.AiTutorResponseStyle),
            MasteryThreshold = await SettingManager.GetSettingValueAsync<int>(AppSettingNames.RecommendationMasteryThreshold),
            RetryLimit = await SettingManager.GetSettingValueAsync<int>(AppSettingNames.RecommendationRetryLimit)
        };
    }

    public async Task<PromptConfigurationDto> UpdateAsync(UpdatePromptConfigurationInput input)
    {
        await SettingManager.ChangeSettingForApplicationAsync(AppSettingNames.AiTutorGeneralPrompt, input.GeneralPrompt);
        await SettingManager.ChangeSettingForApplicationAsync(AppSettingNames.AiTutorLifeSciencesPrompt, input.LifeSciencesPrompt);
        await SettingManager.ChangeSettingForApplicationAsync(AppSettingNames.AiTutorResponseStyle, input.ResponseStyle);
        await SettingManager.ChangeSettingForApplicationAsync(AppSettingNames.RecommendationMasteryThreshold, input.MasteryThreshold.ToString());
        await SettingManager.ChangeSettingForApplicationAsync(AppSettingNames.RecommendationRetryLimit, input.RetryLimit.ToString());

        return await GetAsync();
    }
}
