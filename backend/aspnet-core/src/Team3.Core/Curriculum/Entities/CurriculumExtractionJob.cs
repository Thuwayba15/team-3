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

    public LayoutFamilyType DetectedLayoutFamily { get; set; }

    // Navigation
    public virtual CurriculumSourceDocument SourceDocument { get; set; }
}