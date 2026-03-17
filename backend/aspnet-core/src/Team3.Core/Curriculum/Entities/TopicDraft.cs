using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Entities;

/// <summary>
/// Draft representation of a normalized topic.
/// </summary>
public class TopicDraft : FullAuditedEntity<long>
{
    public long ExtractionJobId { get; set; }

    [Required]
    [StringLength(256)]
    public string Title { get; set; }

    [StringLength(1000)]
    public string Description { get; set; }

    public int Order { get; set; }

    public DraftStatus Status { get; set; }

    // Navigation
    public virtual CurriculumExtractionJob ExtractionJob { get; set; }
}