using Abp.Authorization;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.LearningMaterials.Dto;
using Team3.LearningMaterials.Subjects;
using Xunit;

namespace Team3.Tests.Students;

public class StudentSubjectAppService_Tests : Team3TestBase
{
    private readonly IStudentSubjectAppService _studentSubjectAppService;

    public StudentSubjectAppService_Tests()
    {
        _studentSubjectAppService = Resolve<IStudentSubjectAppService>();
    }

    [Fact]
    public async Task GetAllSubjects_Should_Return_Only_Active_Subjects()
    {
        var activeSubjectId = Guid.NewGuid();
        var inactiveSubjectId = Guid.NewGuid();

        await UsingDbContextAsync(async context =>
        {
            await context.Subjects.AddAsync(new Subject(activeSubjectId, $"Active Subject {Guid.NewGuid():N}", "Grade 10", isActive: true));
            await context.Subjects.AddAsync(new Subject(inactiveSubjectId, $"Inactive Subject {Guid.NewGuid():N}", "Grade 10", isActive: false));
            await context.SaveChangesAsync();
        });

        var result = await _studentSubjectAppService.GetAllSubjectsAsync();

        result.Any(subject => subject.Id == activeSubjectId).ShouldBeTrue();
        result.Any(subject => subject.Id == inactiveSubjectId).ShouldBeFalse();
    }

    [Fact]
    public async Task BulkEnroll_Should_Create_Enrollment_And_Report_Already_Enrolled_Subjects()
    {
        var subjectId = await UsingDbContextAsync(async context =>
        {
            var subject = new Subject(Guid.NewGuid(), $"Enroll Subject {Guid.NewGuid():N}", "Grade 11", isActive: true);
            await context.Subjects.AddAsync(subject);
            await context.SaveChangesAsync();
            return subject.Id;
        });

        var firstResult = await _studentSubjectAppService.BulkEnrollAsync(new BulkEnrollInput
        {
            SubjectIds = [subjectId],
        });

        firstResult.EnrolledSubjectIds.ShouldContain(subjectId);
        firstResult.AlreadyEnrolledSubjectIds.ShouldBeEmpty();

        await UsingDbContextAsync(async context =>
        {
            var enrollments = await context.StudentEnrollments
                .Where(x => x.StudentId == AbpSession.UserId && x.SubjectId == subjectId)
                .ToListAsync();
            var progressRecords = await context.StudentProgresses
                .Where(x => x.StudentId == AbpSession.UserId && x.SubjectId == subjectId)
                .ToListAsync();

            enrollments.Count.ShouldBe(1);
            progressRecords.Count.ShouldBe(1);
        });

        var secondResult = await _studentSubjectAppService.BulkEnrollAsync(new BulkEnrollInput
        {
            SubjectIds = [subjectId],
        });

        secondResult.EnrolledSubjectIds.ShouldBeEmpty();
        secondResult.AlreadyEnrolledSubjectIds.ShouldContain(subjectId);
    }

    [Fact]
    public async Task StudentSubject_Flows_Should_Require_Authentication()
    {
        AbpSession.UserId = null;

        try
        {
            await Assert.ThrowsAsync<AbpAuthorizationException>(() => _studentSubjectAppService.GetMySubjectsAsync());
        }
        finally
        {
            LoginAsDefaultTenantAdmin();
        }
    }
}
