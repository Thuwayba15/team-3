using Team3.Users;
using Team3.Users.Dto;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace Team3.Tests.Users;

public class UserAppService_Tests : Team3TestBase
{
    private readonly IUserAppService _userAppService;

    public UserAppService_Tests()
    {
        _userAppService = Resolve<IUserAppService>();
    }

    [Fact]
    public async Task GetUsers_Test()
    {
        // Act
        var output = await _userAppService.GetAllAsync(new PagedUserResultRequestDto { MaxResultCount = 20, SkipCount = 0 });

        // Assert
        output.Items.Count.ShouldBeGreaterThan(0);
    }

    [Fact]
    public async Task CreateUser_Test()
    {
        // Act
        await _userAppService.CreateAsync(
            new CreateUserDto
            {
                EmailAddress = "john@volosoft.com",
                IsActive = true,
                Name = "John",
                Surname = "Nash",
                Password = "123qwe",
                UserName = "john.nash"
            });

        await UsingDbContextAsync(async context =>
        {
            var johnNashUser = await context.Users.FirstOrDefaultAsync(u => u.UserName == "john.nash");
            johnNashUser.ShouldNotBeNull();
        });
    }

    [Fact]
    public async Task GetUsers_Should_Filter_By_Role()
    {
        await _userAppService.CreateAsync(
            new CreateUserDto
            {
                EmailAddress = "admin.user@volosoft.com",
                IsActive = true,
                Name = "Admin",
                Surname = "User",
                Password = "123qwe",
                UserName = "admin.user",
                RoleNames = new[] { "Admin" }
            });

        var output = await _userAppService.GetAllAsync(new PagedUserResultRequestDto
        {
            MaxResultCount = 20,
            SkipCount = 0,
            RoleName = "Admin"
        });

        output.Items.ShouldContain(user => user.UserName == "admin.user");
    }
}
