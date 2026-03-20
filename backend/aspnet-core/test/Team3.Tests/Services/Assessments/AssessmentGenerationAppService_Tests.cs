using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.Services.Assessments;
using Xunit;

namespace Team3.Tests.Services.Assessments;

public class AssessmentGenerationAppService_Tests : Team3TestBase
{
    private readonly IAssessmentGenerationAppService _assessmentGenerationAppService;

    public AssessmentGenerationAppService_Tests()
    {
        _assessmentGenerationAppService = Resolve<IAssessmentGenerationAppService>();
    }

    [Fact]
    public async Task GenerateLessonQuiz_Should_Create_Assessment_With_Valid_Data()
    {
        // Arrange
        var lessonId = await CreateTestLessonAsync();
        var input = new GenerateLessonQuizInput
        {
            LessonId = lessonId,
        };

        // Act
        var result = await _assessmentGenerationAppService.GenerateLessonQuizAsync(input);

        // Assert
        result.ShouldNotBeNull();
    }

    [Fact]
    public async Task GenerateLessonQuiz_Should_Fail_With_Invalid_Lesson()
    {
        // Arrange
        var input = new GenerateLessonQuizInput
        {
            LessonId = Guid.NewGuid(), // Non-existent lesson
        };

        // Act & Assert
        await Should.ThrowAsync<UserFriendlyException>(async () =>
        {
            await _assessmentGenerationAppService.GenerateLessonQuizAsync(input);
        });
    }

    [Fact]
    public async Task GenerateDiagnosticQuiz_Should_Create_Diagnostic_Test()
    {
        // Arrange
        var subjectId = await CreateTestSubjectAsync();
        await CreateTestTopicAsync(subjectId);
        var input = new GenerateDiagnosticQuizInput
        {
            SubjectId = subjectId,
        };

        // Act
        var result = await _assessmentGenerationAppService.GenerateDiagnosticQuizAsync(input);

        // Assert
        result.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetDiagnosticAssessments_Should_Return_Diagnostic_Tests()
    {
        // Arrange
        var subjectId = await CreateTestSubjectAsync();
        await CreateTestTopicAsync(subjectId);

        // Act
        var result = await _assessmentGenerationAppService.GetDiagnosticAssessmentsAsync(subjectId);

        // Assert
        result.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetLessonAssessments_Should_Return_Lesson_Assessments()
    {
        // Arrange
        var lessonId = await CreateTestLessonAsync();

        // Act
        var result = await _assessmentGenerationAppService.GetLessonAssessmentsAsync(lessonId);

        // Assert
        result.ShouldNotBeNull();
    }

    private async Task<Guid> CreateTestSubjectAsync()
    {
        return await UsingDbContextAsync(async context =>
        {
            var subject = new Subject(Guid.NewGuid(), "Test Subject", "TEST", "Test subject description");
            context.Subjects.Add(subject);
            await context.SaveChangesAsync();
            return subject.Id;
        });
    }

    private async Task<Guid> CreateTestTopicAsync(Guid subjectId)
    {
        return await UsingDbContextAsync(async context =>
        {
            var topic = new Topic(Guid.NewGuid(), subjectId, "Test Topic", DifficultyLevel.Easy);
            context.Topics.Add(topic);
            await context.SaveChangesAsync();
            return topic.Id;
        });
    }

    private async Task<Guid> CreateTestLessonAsync()
    {
        var subjectId = await CreateTestSubjectAsync();
        var topicId = await CreateTestTopicAsync(subjectId);

        return await UsingDbContextAsync(async context =>
        {
            var lesson = new Lesson(Guid.NewGuid(), topicId, "Test Lesson", DifficultyLevel.Easy);
            context.Lessons.Add(lesson);
            await context.SaveChangesAsync();
            return lesson.Id;
        });
    }

    private async Task<Guid> CreateTestAssessmentAsync()
    {
        var subjectId = await CreateTestSubjectAsync();

        return await UsingDbContextAsync(async context =>
        {
            var assessment = new Assessment(
                Guid.NewGuid(),
                Guid.NewGuid(), // TopicId
                null, // LessonId
                "Test Assessment",
                AssessmentType.Practice,
                DifficultyLevel.Medium
            );
            context.Assessments.Add(assessment);
            await context.SaveChangesAsync();
            return assessment.Id;
        });
    }
}
