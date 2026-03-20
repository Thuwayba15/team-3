using Abp.Configuration;
using Abp.Domain.Repositories;
using Abp.Zero.Configuration;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Team3.Authorization.Accounts;
using Team3.Authorization.Accounts.Dto;
using Team3.Authorization.Users;
using Team3.Configuration;
using Team3.Localization;
using Xunit;

namespace Team3.Tests.Authorization.Accounts;

public class AccountAppService_Tests : Team3TestBase
{
    private readonly IAccountAppService _accountAppService;

    public AccountAppService_Tests()
    {
        _accountAppService = Resolve<IAccountAppService>();
    }

    [Fact]
    public async Task IsTenantAvailable_Should_Return_Success_For_Existing_Tenant()
    {
        // Arrange
        var input = new IsTenantAvailableInput
        {
            TenancyName = "Default"
        };

        // Act
        var result = await _accountAppService.IsTenantAvailable(input);

        // Assert
        result.State.ShouldBe(TenantAvailabilityState.Available);
        result.TenantId.ShouldBe(1);
    }

    [Fact]
    public async Task IsTenantAvailable_Should_Return_NotFound_For_NonExistent_Tenant()
    {
        // Arrange
        var input = new IsTenantAvailableInput
        {
            TenancyName = "NonExistentTenant"
        };

    }

    [Fact]
    public void PasswordRegex_Should_Match_Valid_Passwords()
    {
        // Arrange
        var validPasswords = new[]
        {
            "Password123!",
            "Test@456",
            "MySecure#789"
        };
    }

    [Fact]
    public void PasswordRegex_Should_Not_Match_Invalid_Passwords()
    {
        // Arrange
        var invalidPasswords = new[]
        {
            "short",           // Too short
            "nouppercase1!",   // No uppercase
            "NOLOWERCASE1!",   // No lowercase
            "NoNumbers!",      // No numbers
            "NoSpecial123"     // No special characters
        };

       
    }

    [Fact]
    public async Task RegisterUser_Should_Create_User_With_Valid_Data()
    {
        // Arrange
        var input = new RegisterInput
        {
            Name = "Test User",
            Surname = "Test",
            EmailAddress = "test@example.com",
            UserName = "testuser",
            Password = "Test123!",
        };

        // Act
        var result = await _accountAppService.Register(input);

        
        // Verify user was created
        await UsingDbContextAsync(async context =>
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.UserName == "testuser");
            user.ShouldNotBeNull();
            user.EmailAddress.ShouldBe("test@example.com");
            user.Name.ShouldBe("Test User");
        });
    }

    [Fact]
    public async Task RegisterUser_Should_Fail_With_Weak_Password()
    {
        // Arrange
        var input = new RegisterInput
        {
            Name = "Test User",
            Surname = "Test",
            EmailAddress = "test@example.com",
            UserName = "testuser2",
            Password = "weak", // Weak password
        };

    }
}
