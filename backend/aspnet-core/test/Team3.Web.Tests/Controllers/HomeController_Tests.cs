using Team3.Models.TokenAuth;
using Team3.Web.Controllers;
using Shouldly;
using System.Threading.Tasks;
using Xunit;

namespace Team3.Web.Tests.Controllers;

public class HomeController_Tests : Team3WebTestBase
{
    [Fact]
    public async Task Index_Test()
    {
        await AuthenticateAsync(null, new AuthenticateModel
        {
            UserNameOrEmailAddress = "admin",
            Password = "123qwe"
        });

        //Act
        var response = await GetResponseAsStringAsync(
            GetUrl<HomeController>(nameof(HomeController.Index))
        );

        //Assert
        response.ShouldNotBeNullOrEmpty();
    }
}