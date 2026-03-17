using System.ComponentModel.DataAnnotations;

namespace Team3.Curriculum.Dto;

public class PublishCurriculumInput
{
    [Range(1, long.MaxValue)]
    public long ExtractionJobId { get; set; }
}