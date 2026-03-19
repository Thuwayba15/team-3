using System;

namespace Team3.AI.Dto;

public class AIPromptTemplateResponse
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;

    public string Purpose { get; set; } = default!;

    public string TemplateText { get; set; } = default!;

    public double Temperature { get; set; }
}
