using Abp.Authorization;
using Abp.Configuration;
using Igor.Gateway.Dtos.Settings;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Team3.Configuration;
using Team3.Configuration.Dto;
using Xunit;

namespace Team3.Tests.Configuration;

public class ConfigurationAppService_Tests : Team3TestBase
{
    private readonly IConfigurationAppService _configurationAppService;

    public ConfigurationAppService_Tests()
    {
        _configurationAppService = Resolve<IConfigurationAppService>();
    }

    [Fact]
    public async Task GetAllSettings_Should_Return_All_Configuration_Settings()
    {
        // Act

        // Assert

    }

    [Fact]
    public async Task GetSetting_Should_Return_Setting_By_Name()
    {
        // Arrange
        var settingName = "Abp.Zero.LanguageManagement.EnableDbLocalization";

        // Act


    }

    [Fact]
    public async Task UpdateSetting_Should_Modify_Setting_Value()
    {
        // Arrange
        var settingName = "Test.Setting.Value";
        var newValue = "UpdatedValue";




    }

    [Fact]
    public async Task UpdateSetting_Should_Create_New_Setting_If_Not_Exists()
    {
        // Arrange
        var newSettingName = "Test.New.Setting";
        var newSettingValue = "NewValue";

        // Act

    }

    [Fact]
    public async Task DeleteSetting_Should_Remove_Setting()
    {


        // Act

        // Assert
        // Should throw exception when trying to get deleted setting

    }

    [Fact]
    public async Task GetTenantSettings_Should_Return_Tenant_Specific_Settings()
    {
        // Arrange - Already logged in as default tenant admin

        // Act


    }

    [Fact]
    public async Task GetUserSettings_Should_Return_User_Specific_Settings()
    {
        // Arrange - Already logged in as default tenant admin

        // Act


    }

    [Fact]
    public async Task UpdateUserSettings_Should_Modify_User_Settings()
    {
        // Arrange
        var settingName = "Test.User.Setting";
        var userSettingValue = "UserValue";

        // Act

    }

}