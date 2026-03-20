using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Team3.Authorization.Users;
using Team3.MultiTenancy;
using Team3.Sessions;
using Team3.Sessions.Dto;
using Xunit;

namespace Team3.Tests.Sessions;

public class SessionAppService_Tests_Extended : Team3TestBase
{
    private readonly ISessionAppService _sessionAppService;

    public SessionAppService_Tests_Extended()
    {
        _sessionAppService = Resolve<ISessionAppService>();
    }

    [Fact]
    public async Task GetCurrentLoginInformations_Should_Return_Application_Info()
    {
        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.Application.ShouldNotBeNull();
        result.Application.Version.ShouldNotBeNull();
        result.Application.Features.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetCurrentLoginInformations_Should_Return_Tenant_Info_When_Logged_In_As_Tenant()
    {
        // Arrange - Already logged in as default tenant admin from base class

        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.Tenant.ShouldNotBeNull();
        result.Tenant.Id.ShouldBe(1);
        result.Tenant.TenancyName.ShouldBe("Default");
    }

    [Fact]
    public async Task GetCurrentLoginInformations_Should_Return_User_Info_When_Logged_In()
    {
        // Arrange - Already logged in as default tenant admin from base class

        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.User.ShouldNotBeNull();
        result.User.UserName.ShouldBe("admin");
        result.User.Name.ShouldNotBeNull();
        result.User.Surname.ShouldNotBeNull();
        result.User.EmailAddress.ShouldNotBeNull();
    }

    
    [Fact]
    public async Task GetCurrentLoginInformations_Should_Have_Correct_Application_Features()
    {
        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.Application.Features.ShouldNotBeNull();
        result.Application.Features.ShouldBeOfType<System.Collections.Generic.Dictionary<string, bool>>();
    }

    [Fact]
    public async Task GetCurrentLoginInformations_Should_Contain_Valid_Version_Information()
    {
        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.Application.ShouldNotBeNull();
        result.Application.Version.ShouldNotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetCurrentLoginInformations_Should_Map_User_Properties_Correctly()
    {
        // Arrange
        LoginAsDefaultTenantAdmin();

        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.User.ShouldNotBeNull();
        
        // Verify user properties are mapped correctly
        await UsingDbContextAsync(async context =>
        {
            var userId = AbpSession.UserId ?? throw new System.Exception("User not logged in");
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            user.ShouldNotBeNull();
            
            result.User.UserName.ShouldBe(user.UserName);
            result.User.Name.ShouldBe(user.Name);
            result.User.Surname.ShouldBe(user.Surname);
            result.User.EmailAddress.ShouldBe(user.EmailAddress);
        });
    }

    [Fact]
    public async Task GetCurrentLoginInformations_Should_Map_Tenant_Properties_Correctly()
    {
        // Arrange
        LoginAsDefaultTenantAdmin();

        // Act
        var result = await _sessionAppService.GetCurrentLoginInformations();

        // Assert
        result.ShouldNotBeNull();
        result.Tenant.ShouldNotBeNull();
        
        // Verify tenant properties are mapped correctly
        await UsingDbContextAsync(async context =>
        {
            var tenantId = AbpSession.TenantId ?? throw new System.Exception("Tenant not set");
            var tenant = await context.Tenants.FirstOrDefaultAsync(t => t.Id == tenantId);
            tenant.ShouldNotBeNull();
            
            result.Tenant.Id.ShouldBe(tenant.Id);
            result.Tenant.TenancyName.ShouldBe(tenant.TenancyName);
            result.Tenant.Name.ShouldBe(tenant.Name);
        });
    }
}
