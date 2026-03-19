using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class StudentProgressOverviewDto
{
    public SubjectDto Subject { get; set; } = new();

    public StudentProgressDto Progress { get; set; } = new();

    public DiagnosticResultDto? LatestDiagnostic { get; set; }

    public List<string> FocusTopics { get; set; } = [];

    public int PublishedLessonCount { get; set; }
}
