using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.Students;
using Team3.Students.Dto;
using Xunit;

namespace Team3.Tests.Students;

public class StudentRuntimeAppService_Tests : Team3TestBase
{
    private readonly IStudentAssessmentAppService _studentAssessmentAppService;
    private readonly IStudentLearningPathAppService _studentLearningPathAppService;

    public StudentRuntimeAppService_Tests()
    {
        _studentAssessmentAppService = Resolve<IStudentAssessmentAppService>();
        _studentLearningPathAppService = Resolve<IStudentLearningPathAppService>();
    }

    [Fact]
    public async Task SubmitDiagnostic_Should_Create_Attempt_And_Assign_Difficulty()
    {
        var setup = await SeedAssessmentGraphAsync("Diagnostic");

        var result = await _studentAssessmentAppService.SubmitDiagnosticAsync(new SubmitStudentAssessmentInputDto
        {
            AssessmentId = setup.AssessmentId,
            Answers =
            [
                new StudentAssessmentAnswerInputDto
                {
                    QuestionId = setup.QuestionId,
                    SelectedOption = "A"
                }
            ]
        });

        result.Passed.ShouldBeTrue();
        result.AssignedDifficultyLevel.ShouldBe(DifficultyLevel.Hard);

        await UsingDbContextAsync(async context =>
        {
            var attempts = await context.StudentAssessmentAttempts.Where(x => x.AssessmentId == setup.AssessmentId).ToListAsync();
            attempts.Count.ShouldBe(1);

            var topicProgress = await context.StudentTopicProgresses.FirstOrDefaultAsync(x => x.TopicId == setup.TopicId && x.StudentId == AbpSession.UserId);
            topicProgress.ShouldNotBeNull();
            topicProgress.AssignedDifficultyLevel.ShouldBe(DifficultyLevel.Hard);
            topicProgress.Status.ShouldBe(LearningProgressStatus.Current);
        });
    }

    [Fact]
    public async Task GetSubjectPath_Should_Project_Current_Lesson_For_Assigned_Difficulty()
    {
        var setup = await SeedAssessmentGraphAsync("Path");

        await UsingDbContextAsync(async context =>
        {
            await context.StudentTopicProgresses.AddAsync(new StudentTopicProgress(Guid.NewGuid(), AbpSession.UserId!.Value, setup.TopicId, DifficultyLevel.Medium));
            await context.SaveChangesAsync();
        });

        var path = await _studentLearningPathAppService.GetSubjectPathAsync(setup.SubjectId);

        path.SubjectId.ShouldBe(setup.SubjectId);
        path.Topics.Count.ShouldBe(1);
        path.Topics[0].Status.ShouldBe("current");
        path.Topics[0].AssignedDifficultyLevel.ShouldBe(DifficultyLevel.Medium);
        path.Topics[0].Lessons.Count.ShouldBe(1);
        path.Topics[0].Lessons[0].Status.ShouldBe("current");
        path.Topics[0].Lessons[0].QuizAssessmentId.ShouldBe(setup.AssessmentId);
    }

    [Fact]
    public async Task SubmitLessonQuiz_Should_Advance_Difficulty_When_Performance_Is_Strong()
    {
        var setup = await SeedAssessmentGraphAsync("QuizProgressUp");

        await UsingDbContextAsync(async context =>
        {
            await context.StudentTopicProgresses.AddAsync(new StudentTopicProgress(Guid.NewGuid(), AbpSession.UserId!.Value, setup.TopicId, DifficultyLevel.Medium));
            await context.SaveChangesAsync();
        });

        var result = await _studentAssessmentAppService.SubmitLessonQuizAsync(new SubmitStudentAssessmentInputDto
        {
            AssessmentId = setup.AssessmentId,
            Answers =
            [
                new StudentAssessmentAnswerInputDto
                {
                    QuestionId = setup.QuestionId,
                    SelectedOption = "A"
                }
            ]
        });

        result.AssignedDifficultyLevel.ShouldBe(DifficultyLevel.Hard);
    }

    [Fact]
    public async Task SubmitLessonQuiz_Should_Lower_Difficulty_When_Performance_Is_Weak()
    {
        var setup = await SeedAssessmentGraphAsync("QuizProgressDown");

        await UsingDbContextAsync(async context =>
        {
            await context.StudentTopicProgresses.AddAsync(new StudentTopicProgress(Guid.NewGuid(), AbpSession.UserId!.Value, setup.TopicId, DifficultyLevel.Hard));
            await context.SaveChangesAsync();
        });

        var result = await _studentAssessmentAppService.SubmitLessonQuizAsync(new SubmitStudentAssessmentInputDto
        {
            AssessmentId = setup.AssessmentId,
            Answers =
            [
                new StudentAssessmentAnswerInputDto
                {
                    QuestionId = setup.QuestionId,
                    SelectedOption = "B"
                }
            ]
        });

        result.AssignedDifficultyLevel.ShouldBe(DifficultyLevel.Medium);
    }

    private async Task<(Guid SubjectId, Guid TopicId, Guid LessonId, Guid AssessmentId, Guid QuestionId)> SeedAssessmentGraphAsync(string suffix)
    {
        return await UsingDbContextAsync(async context =>
        {
            var english = await context.LearningLanguages.FirstAsync(x => x.Code == "en");

            var subject = new Subject(Guid.NewGuid(), $"Student Runtime {suffix} {Guid.NewGuid():N}", "Grade 10", isActive: true);
            await context.Subjects.AddAsync(subject);

            var topic = new Topic(Guid.NewGuid(), subject.Id, $"Topic {suffix}", DifficultyLevel.Medium, sequenceOrder: 1, isActive: true);
            await context.Topics.AddAsync(topic);

            var lesson = new Lesson(
                Guid.NewGuid(),
                topic.Id,
                $"Lesson {suffix}",
                DifficultyLevel.Medium,
                summary: "Medium lesson",
                learningObjective: "Understand the topic",
                revisionSummary: "Review",
                estimatedMinutes: 15,
                isPublished: true,
                generatedByAI: false);
            await context.Lessons.AddAsync(lesson);

            await context.LessonTranslations.AddAsync(new LessonTranslation(
                Guid.NewGuid(),
                lesson.Id,
                english.Id,
                lesson.Title,
                "Lesson content",
                "Lesson summary",
                examples: null,
                revisionSummary: "Revision",
                isAutoTranslated: false));

            var assessment = new Assessment(
                Guid.NewGuid(),
                topic.Id,
                suffix == "Diagnostic" ? null : lesson.Id,
                $"{suffix} Assessment",
                suffix == "Diagnostic" ? AssessmentType.Diagnostic : AssessmentType.Quiz,
                DifficultyLevel.Medium,
                isPublished: true,
                generatedByAI: false);
            assessment.SetTotalMarks(1);
            await context.Assessments.AddAsync(assessment);

            var question = new Question(
                Guid.NewGuid(),
                assessment.Id,
                QuestionType.MultipleChoice,
                DifficultyLevel.Medium,
                "A",
                "Because A is correct",
                1,
                1,
                generatedByAI: false);
            await context.Questions.AddAsync(question);

            await context.QuestionTranslations.AddAsync(new QuestionTranslation(
                Guid.NewGuid(),
                question.Id,
                english.Id,
                "What is the correct answer?",
                "A",
                "B",
                "C",
                "D",
                "Pick the best answer.",
                "A is the correct answer."));

            await context.StudentEnrollments.AddAsync(new StudentEnrollment(Guid.NewGuid(), AbpSession.UserId!.Value, subject.Id));
            await context.StudentProgresses.AddAsync(new StudentProgress(Guid.NewGuid(), AbpSession.UserId!.Value, subject.Id));
            await context.SaveChangesAsync();

            return (subject.Id, topic.Id, lesson.Id, assessment.Id, question.Id);
        });
    }
}
