using Abp.Authorization;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.Students;
using Team3.Students.Dto;
using Xunit;

namespace Team3.Tests.Students;

public class StudentDashboardAppService_Tests : Team3TestBase
{
    private readonly IStudentDashboardAppService _studentDashboardAppService;

    public StudentDashboardAppService_Tests()
    {
        _studentDashboardAppService = Resolve<IStudentDashboardAppService>();
    }

    [Fact]
    public async Task GetDashboardOverview_Should_Return_Student_Overview()
    {
        // Arrange
        await SeedTestDataAsync();

        // Act

        // Assert
    }

    [Fact]
    public async Task GetRecentProgress_Should_Return_Recent_Activities()
    {
        // Arrange
        await SeedTestDataAsync();

        // Act

        // Assert
    }

    [Fact]
    public async Task GetRecommendedLessons_Should_Return_Lessons_Based_On_Progress()
    {
        // Arrange
        await SeedTestDataAsync();

        // Act

        // Assert
    }

    [Fact]
    public async Task GetUpcomingAssessments_Should_Return_Pending_Assessments()
    {
        // Arrange
        await SeedTestDataAsync();

        // Act

        // Assert
    }

    private async Task SeedTestDataAsync()
    {
        await UsingDbContextAsync(async context =>
        {
            // Create test subject
            var subject = new Subject(Guid.NewGuid(), "Mathematics", "MATH", "Test subject for math");
            context.Subjects.Add(subject);

            // Create test topic

            // Create test lesson

            // Create student enrollment

            // Create student progress

            await context.SaveChangesAsync();
        });
    }

    
}
