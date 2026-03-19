namespace Team3.LearningMaterials.Dto;

public class CurriculumLessonTranslationInput
{
    public string LanguageCode { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string? Summary { get; set; }

    public string? Examples { get; set; }

    public string? RevisionSummary { get; set; }
}
