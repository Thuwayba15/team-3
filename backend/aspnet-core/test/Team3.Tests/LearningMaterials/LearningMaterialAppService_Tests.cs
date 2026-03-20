using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Enums;
using Team3.LearningMaterials;
using Team3.LearningMaterials.Dto;
using Xunit;

namespace Team3.Tests.LearningMaterials;

public class LearningMaterialAppService_Tests : Team3TestBase
{
    private readonly ILearningMaterialAppService _learningMaterialAppService;

    public LearningMaterialAppService_Tests()
    {
        _learningMaterialAppService = Resolve<ILearningMaterialAppService>();
    }

    

    [Fact]
    public async Task UploadTextMaterial_Should_Fail_With_Invalid_Subject()
    {
        // Arrange
        var input = new UploadTextLearningMaterialInput
        {
            SubjectId = Guid.NewGuid(), // Non-existent subject
            Title = "Test Lesson",
            Content = "This is test content.",
            DifficultyLevel = DifficultyLevel.Easy,
            SourceLanguageCode = "en"
        };

        // Act & Assert
        await Should.ThrowAsync<UserFriendlyException>(async () =>
        {
            await _learningMaterialAppService.UploadTextMaterialAsync(input);
        });
    }

    [Fact]
    public async Task UploadTextMaterial_Should_Fail_With_Invalid_Language()
    {
        // Arrange
        var subjectId = await CreateTestSubjectAsync();
        var input = new UploadTextLearningMaterialInput
        {
            SubjectId = subjectId,
            Title = "Test Lesson",
            Content = "This is test content.",
            DifficultyLevel = DifficultyLevel.Easy,
            SourceLanguageCode = "invalid" // Invalid language code
        };

        // Act & Assert
        await Should.ThrowAsync<UserFriendlyException>(async () =>
        {
            await _learningMaterialAppService.UploadTextMaterialAsync(input);
        });
    }

    [Fact]
    public async Task GetSubjects_Should_Return_All_Active_Subjects()
    {
        // Arrange
        await CreateTestSubjectAsync();

        // Act

    }

    [Fact]
    public async Task GetTopicsBySubject_Should_Return_Topics_For_Valid_Subject()
    {
        // Arrange
        var subjectId = await CreateTestSubjectAsync();
        await CreateTestTopicAsync(subjectId);

        // Act


    }

    [Fact]
    public async Task GetLessonsByTopic_Should_Return_Lessons_For_Valid_Topic()
    {
        // Arrange
        var subjectId = await CreateTestSubjectAsync();
        var topicId = await CreateTestTopicAsync(subjectId);
        await CreateTestLessonAsync(topicId);

        // Act

        // Assert
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

    private async Task<Guid> CreateTestLessonAsync(Guid topicId)
    {
        return await UsingDbContextAsync(async context =>
        {
            var lesson = new Lesson(Guid.NewGuid(), topicId, "Test Lesson", DifficultyLevel.Easy);
            context.Lessons.Add(lesson);
            await context.SaveChangesAsync();
            return lesson.Id;
        });
    }
}
