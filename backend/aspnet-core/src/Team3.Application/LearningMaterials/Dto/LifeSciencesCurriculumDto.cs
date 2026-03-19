using System;
using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class LifeSciencesCurriculumDto
{
    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = string.Empty;

    public string GradeLevel { get; set; } = string.Empty;

    public string? Description { get; set; }

    public List<CurriculumTopicDetailDto> Topics { get; set; } = [];
}
