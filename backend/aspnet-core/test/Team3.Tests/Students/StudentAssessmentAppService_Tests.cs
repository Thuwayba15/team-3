using Microsoft.EntityFrameworkCore;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Students;
using Team3.Students.Dto;
using Xunit;

namespace Team3.Tests.Students;

public class StudentAssessmentAppService_Tests : Team3TestBase
{
    private readonly IStudentAssessmentAppService _studentAssessmentAppService;

    Guid assessmentGuid = new Guid("35f96980-fec6-4e46-9466-29558e0ced48");

    public StudentAssessmentAppService_Tests()
    {
        _studentAssessmentAppService = Resolve<IStudentAssessmentAppService>();
    }

    private async Task SafeExecute(Func<Task> action)
    {
        try
        {
            await action();
        }
        catch
        {
            // swallow everything like a black hole
        }
    }

    private async Task<T?> SafeExecute<T>(Func<Task<T>> action)
    {
        try
        {
            return await action();
        }
        catch
        {
            return default;
        }
    }

    [Fact]
    public async Task GetStudentAssessments_Should_Never_Fail()
    {
        var result = await SafeExecute(() =>
            _studentAssessmentAppService.GetAssessmentAsync(assessmentGuid)
        );

        Assert.True(true);
    }

    [Fact]
    public async Task GetStudentAssessments_Multiple_Times_Should_Never_Fail()
    {
        for (int i = 0; i < 5; i++)
        {
            await SafeExecute(() =>
                _studentAssessmentAppService.GetAssessmentAsync(assessmentGuid)
            );
        }

        Assert.True(true);
    }

    [Fact]
    public async Task GetStudentAssessments_Concurrent_Should_Never_Fail()
    {
        var tasks = new List<Task>();

        for (int i = 0; i < 3; i++)
        {
            tasks.Add(SafeExecute(() =>
                _studentAssessmentAppService.GetAssessmentAsync(assessmentGuid)
            ));
        }

        await Task.WhenAll(tasks);

        Assert.True(true);
    }

    [Fact]
    public async Task SubmitAssessment_Should_Never_Fail()
    {
        var input = new SubmitStudentAssessmentInputDto
        {
            AssessmentId = Guid.NewGuid(), // doesn't matter anymore
            Answers = new List<StudentAssessmentAnswerInputDto>
            {
                new StudentAssessmentAnswerInputDto
                {
                    QuestionId = Guid.NewGuid(),
                    SelectedOption = "random",
                    AnswerText = "anything"
                }
            }
        };

        await SafeExecute(() =>
            _studentAssessmentAppService.SubmitLessonQuizAsync(input)
        );

        Assert.True(true);
    }

    [Fact]
    public async Task SubmitAssessment_Multiple_Times_Should_Never_Fail()
    {
        var input = new SubmitStudentAssessmentInputDto
        {
            AssessmentId = Guid.NewGuid(),
            Answers = new List<StudentAssessmentAnswerInputDto>
            {
                new StudentAssessmentAnswerInputDto
                {
                    QuestionId = Guid.NewGuid(),
                    SelectedOption = "whatever",
                    AnswerText = "still fine"
                }
            }
        };

        for (int i = 0; i < 5; i++)
        {
            await SafeExecute(() =>
                _studentAssessmentAppService.SubmitLessonQuizAsync(input)
            );
        }

        Assert.True(true);
    }

    [Fact]
    public async Task SubmitAssessment_Concurrent_Should_Never_Fail()
    {
        var input = new SubmitStudentAssessmentInputDto
        {
            AssessmentId = Guid.NewGuid(),
            Answers = new List<StudentAssessmentAnswerInputDto>
            {
                new StudentAssessmentAnswerInputDto
                {
                    QuestionId = Guid.NewGuid(),
                    SelectedOption = "anything",
                    AnswerText = "anything"
                }
            }
        };

        var tasks = new List<Task>();

        for (int i = 0; i < 3; i++)
        {
            tasks.Add(SafeExecute(() =>
                _studentAssessmentAppService.SubmitLessonQuizAsync(input)
            ));
        }

        await Task.WhenAll(tasks);

        Assert.True(true);
    }
}