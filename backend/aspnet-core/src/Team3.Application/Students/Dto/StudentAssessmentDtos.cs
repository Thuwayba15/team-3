using System;
using System.Collections.Generic;
using Team3.Enums;

namespace Team3.Students.Dto
{
    public class StudentAssessmentQuestionDto
    {
        public Guid QuestionId { get; set; }
        public QuestionType QuestionType { get; set; }
        public int SequenceOrder { get; set; }
        public decimal Marks { get; set; }
        public string QuestionText { get; set; } = default!;
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }
        public string? HintText { get; set; }
        public string LanguageCode { get; set; } = default!;
        public string LanguageName { get; set; } = default!;
    }

    public class StudentAssessmentDto
    {
        public Guid AssessmentId { get; set; }
        public Guid SubjectId { get; set; }
        public Guid TopicId { get; set; }
        public Guid? LessonId { get; set; }
        public string SubjectName { get; set; } = default!;
        public string TopicName { get; set; } = default!;
        public string Title { get; set; } = default!;
        public AssessmentType AssessmentType { get; set; }
        public DifficultyLevel DifficultyLevel { get; set; }
        public decimal TotalMarks { get; set; }
        public string LanguageCode { get; set; } = default!;
        public List<StudentAssessmentQuestionDto> Questions { get; set; } = new();
    }

    public class StudentAssessmentAnswerInputDto
    {
        public Guid QuestionId { get; set; }
        public string? SelectedOption { get; set; }
        public string? AnswerText { get; set; }
    }

    public class SubmitStudentAssessmentInputDto
    {
        public Guid AssessmentId { get; set; }
        public List<StudentAssessmentAnswerInputDto> Answers { get; set; } = new();
    }

    public class StudentQuestionFeedbackDto
    {
        public Guid QuestionId { get; set; }
        public string? SelectedOption { get; set; }
        public string? AnswerText { get; set; }
        public bool IsCorrect { get; set; }
        public decimal MarksAwarded { get; set; }
        public string? CorrectAnswer { get; set; }
        public string? ExplanationText { get; set; }
    }

    public class SubmitStudentAssessmentOutputDto
    {
        public Guid AttemptId { get; set; }
        public Guid AssessmentId { get; set; }
        public decimal Score { get; set; }
        public decimal TotalMarks { get; set; }
        public decimal Percentage { get; set; }
        public bool Passed { get; set; }
        public DifficultyLevel AssignedDifficultyLevel { get; set; }
        public string NextRecommendedAction { get; set; } = default!;
        public int AttemptNumber { get; set; }
        public List<StudentQuestionFeedbackDto> Feedback { get; set; } = new();
    }
}
