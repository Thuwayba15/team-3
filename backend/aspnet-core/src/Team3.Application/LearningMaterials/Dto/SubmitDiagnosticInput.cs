using System;
using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class SubmitDiagnosticInput
{
    public Guid TopicId { get; set; }

    public Dictionary<string, string> Answers { get; set; } = [];
}
