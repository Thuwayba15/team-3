namespace Team3.LearningMaterials.Dto;

public class StudentDashboardDto
{
    public SubjectDto? Subject { get; set; }

    public TopicDto? RecommendedTopic { get; set; }

    public LessonSummaryDto? RecommendedLesson { get; set; }

    public StudentProgressDto? Progress { get; set; }

    public DiagnosticResultDto? LatestDiagnostic { get; set; }
}
