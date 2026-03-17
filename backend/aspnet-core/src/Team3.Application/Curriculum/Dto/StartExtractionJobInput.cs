using System.ComponentModel.DataAnnotations;

namespace Team3.Curriculum.Dto;

public class StartExtractionJobInput
{
    [Range(1, long.MaxValue)]
    public long SourceDocumentId { get; set; }
}