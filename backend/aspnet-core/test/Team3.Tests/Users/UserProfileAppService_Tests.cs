using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Team3.Authorization.Users;
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
    public async Task GetMyProfileAsync_Should_Return_Current_User_Info()
    {
        // Arrange - Already logged in as default tenant admin

        // Act
        var result = await _userProfileAppService.GetMyProfileAsync();

        // Assert
        result.ShouldNotBeNull();
        result.EmailAddress.ShouldNotBeNull();
        result.Name.ShouldNotBeNull();
        result.Surname.ShouldNotBeNull();
    }

    

    [Fact]
    public async Task GetActiveLanguagesAsync_Should_Return_Available_Languages()
    {
        // Act
        var result = await _userProfileAppService.GetActiveLanguagesAsync();

        // Assert
        result.ShouldNotBeNull();
        result.Items.Count.ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task UpdatePlatformLanguageAsync_Should_Change_User_Language()
    {
        // Arrange


        // Act

        // Assert
    }

    [Fact]
    public async Task GetMyPlatformLanguageAsync_Should_Return_User_Language()
    {
        // Act
        var result = await _userProfileAppService.GetMyPlatformLanguageAsync();

        // Assert
        result.ShouldNotBeNull();
    }

    private async Task<long> CreateTestUserAsync(string userName)
    {
        return await UsingDbContextAsync(async context =>
        {
            var user = new User
            {
                UserName = userName,
                Name = "Test",
                Surname = "User",
                EmailAddress = $"{userName}@example.com",
                Password = "AQAAAAEAACcQAAAAEKqgkTvtFvYFGj2Zksqj1JvX2rXgJL+8v8f8f8f8f8f8", // Hashed password
                IsActive = true
            };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            return user.Id;
        });
    }
}
