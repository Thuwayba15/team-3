namespace Team3.AI.Dto;

public class CreateAIPromptTemplateRequest
{
    public string Name { get; set; } = default!;

    public string Purpose { get; set; } = default!;

    public string TemplateText { get; set; } = default!;

    public double Temperature { get; set; }
}
