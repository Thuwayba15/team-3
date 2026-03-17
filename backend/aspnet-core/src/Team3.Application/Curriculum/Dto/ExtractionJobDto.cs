using System;
using Abp.Application.Services.Dto;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Dto;

public class ExtractionJobDto : EntityDto<long>
{
    public long SourceDocumentId { get; set; }
    public ExtractionJobStatus Status { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string ErrorMessage { get; set; }
    public LayoutFamilyType DetectedLayoutFamily { get; set; }
}