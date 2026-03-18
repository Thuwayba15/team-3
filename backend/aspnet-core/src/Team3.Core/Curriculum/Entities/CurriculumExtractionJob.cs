using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Entities;

/// <summary>
/// Tracks the lifecycle of a curriculum extraction and parsing job.
/// </summary>
public class CurriculumExtractionJob : FullAuditedEntity<long>
{
    public long SourceDocumentId { get; set; }

    public ExtractionJobStatus Status { get; set; }

    public DateTime? StartedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    [StringLength(1024)]
    public string ErrorMessage { get; set; }

    public ExtractionProcessingStage ProcessingStage { get; set; }

    [StringLength(2048)]
    public string SourceUrlSnapshot { get; set; }

    [StringLength(128)]
    public string DownloadedContentType { get; set; }

    public long? DownloadedFileSize { get; set; }

    public LayoutFamilyType DetectedLayoutFamily { get; set; }

    public ExtractionMode? ExtractionMode { get; set; }

    public double? ClassificationConfidence { get; set; }

    [StringLength(2000)]
    public string CandidateFamilies { get; set; }

    [StringLength(128)]
    public string ParserName { get; set; }

    public double? ParserConfidence { get; set; }

    [StringLength(4000)]
    public string WarningMessages { get; set; }

    // Navigation
    public virtual CurriculumSourceDocument SourceDocument { get; set; }
}
