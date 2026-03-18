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
    public ExtractionProcessingStage ProcessingStage { get; set; }
    public string SourceUrlSnapshot { get; set; }
    public string DownloadedContentType { get; set; }
    public long? DownloadedFileSize { get; set; }
    public LayoutFamilyType DetectedLayoutFamily { get; set; }
    public ExtractionMode? ExtractionMode { get; set; }
    public double? ClassificationConfidence { get; set; }
    public string CandidateFamilies { get; set; }
    public string ParserName { get; set; }
    public double? ParserConfidence { get; set; }
    public string WarningMessages { get; set; }
}
