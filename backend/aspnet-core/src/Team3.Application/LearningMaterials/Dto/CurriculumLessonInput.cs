using Team3.Enums;

namespace Team3.LearningMaterials.Dto;

public class CurriculumLessonInput
{
    public string Title { get; set; } = string.Empty;

    public string? Summary { get; set; }

    public string? LearningObjective { get; set; }

    public string? RevisionSummary { get; set; }

    public DifficultyLevel DifficultyLevel { get; set; }

    public int EstimatedMinutes { get; set; } = 15;

    public bool IsPublished { get; set; } = true;
}
