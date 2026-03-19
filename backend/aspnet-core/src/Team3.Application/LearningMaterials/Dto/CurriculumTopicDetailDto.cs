using System;
using System.Collections.Generic;
using Team3.Enums;

namespace Team3.LearningMaterials.Dto;

public class CurriculumTopicDetailDto
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public DifficultyLevel DifficultyLevel { get; set; }

    public int SequenceOrder { get; set; }

    public bool IsActive { get; set; }

    public decimal MasteryThreshold { get; set; }

    public List<LessonSummaryDto> Lessons { get; set; } = [];
}
