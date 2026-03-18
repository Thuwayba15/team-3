using System;
using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto;

public class UploadTextLearningMaterialOutput
{
    public Guid SourceMaterialId { get; set; }

    public Guid SubjectId { get; set; }

    public Guid TopicId { get; set; }

    public Guid LessonId { get; set; }

    public string Title { get; set; } = default!;

    public string SourceLanguageCode { get; set; } = default!;

    public IReadOnlyList<LessonTranslationDto> Translations { get; set; } = Array.Empty<LessonTranslationDto>();
}
