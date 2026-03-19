using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class StudentLearningPathDto
{
    public SubjectDto Subject { get; set; } = new();

    public StudentProgressDto Progress { get; set; } = new();

    public List<CurriculumTopicDetailDto> Topics { get; set; } = [];

    public TopicDto? RecommendedTopic { get; set; }

    public LessonSummaryDto? RecommendedLesson { get; set; }

    public DiagnosticResultDto? LatestDiagnostic { get; set; }
}
