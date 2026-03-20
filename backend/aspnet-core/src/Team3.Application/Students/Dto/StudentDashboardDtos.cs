using System;
using System.Collections.Generic;

namespace Team3.Students.Dto
{
    public class StudentDashboardRecentQuizDto
    {
        public Guid AttemptId { get; set; }
        public string Title { get; set; } = default!;
        public string TopicName { get; set; } = default!;
        public decimal Percentage { get; set; }
        public bool Passed { get; set; }
        public DateTime SubmittedAt { get; set; }
    }

    public class StudentDashboardCompletedLessonDto
    {
        public Guid LessonId { get; set; }
        public string Title { get; set; } = default!;
        public string TopicName { get; set; } = default!;
        public DateTime? CompletedAt { get; set; }
    }

    public class StudentDashboardWeakTopicDto
    {
        public Guid TopicId { get; set; }
        public string TopicName { get; set; } = default!;
        public decimal MasteryScore { get; set; }
        public bool NeedsRevision { get; set; }
    }

    public class StudentDashboardRecommendationDto
    {
        public Guid? LessonId { get; set; }
        public string? LessonTitle { get; set; }
        public string? TopicName { get; set; }
        public string? Reason { get; set; }
    }

    public class StudentDashboardRevisionAdviceDto
    {
        public string? TopicName { get; set; }
        public decimal MasteryScore { get; set; }
        public string? Advice { get; set; }
    }

    public class StudentDashboardTopicMasteryDto
    {
        public Guid TopicId { get; set; }
        public string TopicName { get; set; } = default!;
        public string SubjectName { get; set; } = default!;
        public decimal MasteryScore { get; set; }
    }

    public class StudentDashboardProgressDto
    {
        public Guid? SubjectId { get; set; }
        public string? SubjectName { get; set; }
        public decimal OverallScore { get; set; }
        public int TopicsMastered { get; set; }
        public int LessonsCompleted { get; set; }
        public int QuizzesPassed { get; set; }
        public bool NeedsIntervention { get; set; }
        public List<StudentDashboardRecentQuizDto> RecentQuizzes { get; set; } = new();
        public List<StudentDashboardCompletedLessonDto> CompletedLessons { get; set; } = new();
        public List<StudentDashboardWeakTopicDto> WeakTopics { get; set; } = new();
        public List<StudentDashboardTopicMasteryDto> TopicMasteries { get; set; } = new();
        public StudentDashboardRecommendationDto? RecommendedLesson { get; set; }
        public List<StudentDashboardRevisionAdviceDto> RevisionAdvices { get; set; } = new();
        public string? MotivationalGuidance { get; set; }
    }
}
