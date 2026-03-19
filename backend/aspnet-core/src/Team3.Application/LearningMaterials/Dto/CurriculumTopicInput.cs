using Team3.Enums;

namespace Team3.LearningMaterials.Dto;

public class CurriculumTopicInput
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DifficultyLevel DifficultyLevel { get; set; }

    public int SequenceOrder { get; set; }

    public bool IsActive { get; set; } = true;

    public decimal MasteryThreshold { get; set; } = 0.70m;
}
