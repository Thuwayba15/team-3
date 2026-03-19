using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Localization;
using Team3.Users;
using Team3.Users.Dto;
using Xunit;

namespace Team3.Tests.Users;

public class UserProfileAppService_Tests : Team3TestBase
{
    private readonly IUserProfileAppService _userProfileAppService;

    public UserProfileAppService_Tests()
    {
        _userProfileAppService = Resolve<IUserProfileAppService>();
    }

    [Fact]
    public async Task GetActiveLanguages_Should_Return_Only_Active_NotDeleted_Languages()
    {
        await UpsertPlatformLanguageAsync("t14a", "Phase14 Active", isActive: true, isDefault: false, isDeleted: false, sortOrder: 200);
        await UpsertPlatformLanguageAsync("t14i", "Phase14 Inactive", isActive: false, isDefault: false, isDeleted: false, sortOrder: 201);
        await UpsertPlatformLanguageAsync("t14d", "Phase14 Deleted", isActive: true, isDefault: false, isDeleted: true, sortOrder: 202);

        var result = await _userProfileAppService.GetActiveLanguagesAsync();

        result.Items.Any(item => item.Code == "t14a").ShouldBeTrue();
        result.Items.Any(item => item.Code == "t14i").ShouldBeFalse();
        result.Items.Any(item => item.Code == "t14d").ShouldBeFalse();
    }

    [Fact]
    public async Task UpdatePlatformLanguage_Should_Persist_Normalized_Code()
    {
        await UpsertPlatformLanguageAsync("t14z", "Phase14 Z", isActive: true, isDefault: false, isDeleted: false, sortOrder: 210);

        var userId = await GetCurrentUserIdAsync();
        await RemoveUserLanguagePreferenceAsync(userId);

        var output = await _userProfileAppService.UpdatePlatformLanguageAsync(new UpdatePlatformLanguageInput
        {
            PreferredLanguage = " T14Z "
        });

        output.PreferredLanguage.ShouldBe("t14z");

        await UsingDbContextAsync(async context =>
        {
            var storedPreference = await context.UserLanguagePreferences.FirstOrDefaultAsync(preference => preference.UserId == userId);
            storedPreference.ShouldNotBeNull();
            storedPreference.LanguageCode.ShouldBe("t14z");
        });
    }

    [Fact]
    public async Task UpdatePlatformLanguage_Should_Reject_Inactive_Language()
    {
        await UpsertPlatformLanguageAsync("t14x", "Phase14 X", isActive: false, isDefault: false, isDeleted: false, sortOrder: 220);

        var exception = await Should.ThrowAsync<UserFriendlyException>(() =>
            _userProfileAppService.UpdatePlatformLanguageAsync(new UpdatePlatformLanguageInput
            {
                PreferredLanguage = "t14x"
            }));

        exception.Message.ShouldContain("invalid or inactive");
    }

    [Fact]
    public async Task GetMyPlatformLanguage_Should_Return_Default_When_No_Preference_Exists()
    {
        await ResetDefaultLanguageAsync("t14default", "Phase14 Default", sortOrder: 230);

        var userId = await GetCurrentUserIdAsync();
        await RemoveUserLanguagePreferenceAsync(userId);

        var output = await _userProfileAppService.GetMyPlatformLanguageAsync();

        output.PreferredLanguage.ShouldBe("t14default");
    }

    [Fact]
    public async Task GetMyPlatformLanguage_Should_Fallback_To_Default_When_Preference_Is_Inactive()
    {
        await ResetDefaultLanguageAsync("t14fallback", "Phase14 Fallback", sortOrder: 240);
        await UpsertPlatformLanguageAsync("t14old", "Phase14 Old", isActive: false, isDefault: false, isDeleted: false, sortOrder: 241);

        var userId = await GetCurrentUserIdAsync();
        await SetUserLanguagePreferenceAsync(userId, "t14old");

        var output = await _userProfileAppService.GetMyPlatformLanguageAsync();

        output.PreferredLanguage.ShouldBe("t14fallback");
    }

    private async Task<long> GetCurrentUserIdAsync()
    {
        var user = await GetCurrentUserAsync();
        return user.Id;
    }

    private async Task UpsertPlatformLanguageAsync(
        string code,
        string name,
        bool isActive,
        bool isDefault,
        bool isDeleted,
        int sortOrder)
    {
        await UsingDbContextAsync(async context =>
        {
            var language = await context.PlatformLanguages.FirstOrDefaultAsync(item => item.Code == code);
            if (language == null)
            {
                await context.PlatformLanguages.AddAsync(new PlatformLanguage
                {
                    Code = code,
                    Name = name,
                    NativeName = name,
                    IsActive = isActive,
                    IsDefault = isDefault,
                    SortOrder = sortOrder,
                    CreationTime = DateTime.UtcNow,
                    IsDeleted = isDeleted,
                });
                return;
            }

            language.Name = name;
            language.NativeName = name;
            language.IsActive = isActive;
            language.IsDefault = isDefault;
            language.SortOrder = sortOrder;
            language.IsDeleted = isDeleted;
            language.LastModificationTime = DateTime.UtcNow;

            context.PlatformLanguages.Update(language);
        });
    }

    private async Task ResetDefaultLanguageAsync(string code, string name, int sortOrder)
    {
        await UsingDbContextAsync(async context =>
        {
            var allLanguages = await context.PlatformLanguages.ToListAsync();
            foreach (var language in allLanguages)
            {
                language.IsDefault = false;
                language.LastModificationTime = DateTime.UtcNow;
            }
        });

        await UpsertPlatformLanguageAsync(code, name, isActive: true, isDefault: true, isDeleted: false, sortOrder: sortOrder);
    }

    private async Task RemoveUserLanguagePreferenceAsync(long userId)
    {
        await UsingDbContextAsync(async context =>
        {
            var preference = await context.UserLanguagePreferences.FirstOrDefaultAsync(item => item.UserId == userId);
            if (preference == null)
            {
                return;
            }

            context.UserLanguagePreferences.Remove(preference);
        });
    }

    private async Task SetUserLanguagePreferenceAsync(long userId, string languageCode)
    {
        await UsingDbContextAsync(async context =>
        {
            var preference = await context.UserLanguagePreferences.FirstOrDefaultAsync(item => item.UserId == userId);
            if (preference == null)
            {
                await context.UserLanguagePreferences.AddAsync(new UserLanguagePreference(userId, languageCode));
                return;
            }

            preference.SetLanguageCode(languageCode);
            context.UserLanguagePreferences.Update(preference);
        });
    }
}
