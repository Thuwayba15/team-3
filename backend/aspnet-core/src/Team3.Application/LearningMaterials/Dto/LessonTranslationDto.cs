namespace Team3.LearningMaterials.Dto;

public class LessonTranslationDto
{
    public string LanguageCode { get; set; } = default!;

    public string LanguageName { get; set; } = default!;

    public string Title { get; set; } = default!;

    public string Content { get; set; } = default!;

    public string? Summary { get; set; }

    public string? Examples { get; set; }

    public string? RevisionSummary { get; set; }

    public bool IsAutoTranslated { get; set; }
}
