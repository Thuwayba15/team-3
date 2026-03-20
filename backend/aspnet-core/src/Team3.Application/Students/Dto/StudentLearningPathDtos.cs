using System;
using System.Collections.Generic;
using Team3.Enums;

namespace Team3.Students.Dto
{
    public class StudentLearningPathLessonDto
    {
        public Guid LessonId { get; set; }
        public string Title { get; set; } = default!;
        public DifficultyLevel DifficultyLevel { get; set; }
        public int EstimatedMinutes { get; set; }
        public string Status { get; set; } = default!;
        public string ActionState { get; set; } = default!;
        public bool CanComplete { get; set; }
        public Guid? QuizAssessmentId { get; set; }
        public string QuizStatus { get; set; } = default!;
        public string? QuizUnavailableReason { get; set; }
    }

    public class StudentLearningPathTopicDto
    {
        public Guid TopicId { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public string Status { get; set; } = default!;
        public DifficultyLevel? AssignedDifficultyLevel { get; set; }
        public decimal MasteryScore { get; set; }
        public bool NeedsRevision { get; set; }
        public Guid? DiagnosticAssessmentId { get; set; }
        public string RecommendedAction { get; set; } = default!;
        public List<StudentLearningPathLessonDto> Lessons { get; set; } = new();
    }

    public class StudentLearningPathDto
    {
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; } = default!;
        public string GradeLevel { get; set; } = default!;
        public decimal OverallProgressPercent { get; set; }
        public string RecommendedAction { get; set; } = default!;
        public List<StudentLearningPathTopicDto> Topics { get; set; } = new();
    }

    public class CompleteLessonInputDto
    {
        public Guid LessonId { get; set; }
    }

    public class CompleteLessonOutputDto
    {
        public Guid LessonId { get; set; }
        public string Status { get; set; } = default!;
        public string ActionState { get; set; } = default!;
        public string NextRecommendedAction { get; set; } = default!;
        public Guid SubjectId { get; set; }
        public Guid TopicId { get; set; }
    }
}
