using Abp.Domain.Entities.Auditing;
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

    [Required]
    [StringLength(512)]
    public string FilePath { get; set; }

    [Required]
    [StringLength(256)]
    public string OriginalFileName { get; set; }

    public long FileSize { get; set; }

    [StringLength(128)]
    public string ContentType { get; set; }
}