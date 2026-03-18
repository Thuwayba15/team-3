using Abp.Domain.Entities.Auditing;
using System;
using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Entities;

/// <summary>
/// Represents an uploaded source document for curriculum ingestion.
/// </summary>
public class CurriculumSourceDocument : FullAuditedEntity<long>
{
    [Required]
    [StringLength(256)]
    public string SubjectName { get; set; }

    [Required]
    [StringLength(64)]
    public string GradeLevel { get; set; }

    public SourceDocumentType DocumentType { get; set; }

    public SourceDocumentSourceKind SourceKind { get; set; } = SourceDocumentSourceKind.RemotePdfUrl;

    [Required]
    [StringLength(2048)]
    public string SourceUrl { get; set; }

    [Required]
    [StringLength(256)]
    public string OriginalFileName { get; set; }

    public long? FileSize { get; set; }

    [StringLength(128)]
    public string ContentType { get; set; }

    public DateTime? LastFetchedAt { get; set; }

    [StringLength(1024)]
    public string DownloadErrorMessage { get; set; }
}
