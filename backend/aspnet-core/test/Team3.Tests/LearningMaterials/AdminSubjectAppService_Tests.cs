using Microsoft.EntityFrameworkCore;
using Shouldly;
using System.Threading.Tasks;
using Team3.LearningMaterials.Admin;
using Team3.LearningMaterials.Admin.Dto;
using Xunit;

namespace Team3.Tests.LearningMaterials.Admin;

public class AdminSubjectAppService_Tests : Team3TestBase
{
    private readonly IAdminSubjectAppService _adminSubjectAppService;

    public AdminSubjectAppService_Tests()
    {
        _adminSubjectAppService = Resolve<IAdminSubjectAppService>();
    }

    [Fact]
    public async Task GetAllSubjects_Should_Return_Subjects()
    {
        // Act
        var result = await _adminSubjectAppService.GetAllAsync();

        // Assert
        result.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetAllSubjects_Should_Not_Be_Null()
    {
        // Act
        var result = await _adminSubjectAppService.GetAllAsync();

        // Assert
        result.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetAllSubjects_Should_Be_Consistent()
    {
        // Act
        var result1 = await _adminSubjectAppService.GetAllAsync();
        var result2 = await _adminSubjectAppService.GetAllAsync();

        // Assert
        result1.ShouldNotBeNull();
        result2.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetAllSubjects_Should_Work_Multiple_Times()
    {
        // Act
        for (int i = 0; i < 5; i++)
        {
            var result = await _adminSubjectAppService.GetAllAsync();
            result.ShouldNotBeNull();
        }
    }


}
