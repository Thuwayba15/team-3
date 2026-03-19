using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class DiagnosticQuestionDto
{
    public string Id { get; set; } = string.Empty;

    public string Prompt { get; set; } = string.Empty;

    public List<string> Options { get; set; } = [];
}
