using System;
using Team3.Enums;

namespace Team3.LearningMaterials.Dto;

public class UploadTextLearningMaterialInput
{
    public Guid SubjectId { get; set; }

    public Guid? TopicId { get; set; }

    public string? TopicName { get; set; }

    public string? TopicDescription { get; set; }

    public string Title { get; set; } = default!;

    public string Content { get; set; } = default!;

    public string? Summary { get; set; }

    public string? Examples { get; set; }

    public string? RevisionSummary { get; set; }

    public string? LearningObjective { get; set; }

    public DifficultyLevel DifficultyLevel { get; set; } = DifficultyLevel.Medium;

    public int EstimatedMinutes { get; set; } = 15;

    public bool IsPublished { get; set; }

    public string SourceLanguageCode { get; set; } = "en";

    public string? GradeLevel { get; set; }

    public string? Description { get; set; }
}
