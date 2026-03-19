using System;
using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class DiagnosticQuestionSetDto
{
    public Guid SubjectId { get; set; }

    public Guid TopicId { get; set; }

    public string SubjectName { get; set; } = string.Empty;

    public string TopicName { get; set; } = string.Empty;

    public List<DiagnosticQuestionDto> Questions { get; set; } = [];
}
