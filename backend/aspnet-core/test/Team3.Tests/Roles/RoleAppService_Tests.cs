using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using Team3.Authorization.Roles;
using Team3.Roles;
using Team3.Roles.Dto;
using Xunit;

namespace Team3.Tests.Roles;

public class RoleAppService_Tests : Team3TestBase
{
    private readonly IRoleAppService _roleAppService;

    public RoleAppService_Tests()
    {
        _roleAppService = Resolve<IRoleAppService>();
    }

    [Fact]
    public async Task GetRolesAsync_Should_Return_All_Roles()
    {
        // Arrange
        var input = new GetRolesInput();

        // Act
        var result = await _roleAppService.GetRolesAsync(input);

        // Assert
        result.ShouldNotBeNull();
        result.Items.Count.ShouldBeGreaterThan(0);
        result.Items.ShouldContain(r => r.Name == "Admin");
    }

    [Fact]
    public async Task GetRoleForEdit_Should_Return_Role_Details()
    {
        // Arrange
        var roleId = await GetAdminRoleIdAsync();

        // Act


    }

    

    [Fact]
    public async Task CreateRole_Should_Fail_With_Duplicate_Name()
    {
        // Arrange
        var input = new CreateRoleDto
        {
            Name = "Admin", // Already exists
            DisplayName = "Duplicate Admin",
            Description = "Duplicate admin role",
        };

       
    }
    

    [Fact]
    public async Task GetAllPermissions_Should_Return_All_Permissions()
    {
        // Act
        var result = await _roleAppService.GetAllPermissions();

        // Assert
        result.ShouldNotBeNull();
        result.Items.Count.ShouldBeGreaterThan(0);
        result.Items.ShouldContain(p => p.Name == "Pages.Users");
    }

    private async Task<int> GetAdminRoleIdAsync()
    {
        return await UsingDbContextAsync(async context =>
        {
            var adminRole = await context.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
            return adminRole?.Id ?? 0;
        });
    }

    private async Task<int> CreateTestRoleAsync(string roleName)
    {
        return await UsingDbContextAsync(async context =>
        {
            var role = new Role
            {
                Name = roleName,
                DisplayName = $"Test {roleName}",
                Description = "Test role for unit testing",
                IsStatic = false
            };
            context.Roles.Add(role);
            await context.SaveChangesAsync();
            return role.Id;
        });
    }
}
