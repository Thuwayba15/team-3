using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Entities;

/// <summary>
/// Draft content blocks for a lesson.
/// </summary>
public class LessonMaterialDraft : FullAuditedEntity<long>
{
    public long LessonDraftId { get; set; }

    [Required]
    [StringLength(256)]
    public string Title { get; set; }

    [StringLength(4000)]
    public string Content { get; set; }

    public int Order { get; set; }

    public DraftStatus Status { get; set; }

    // Navigation
    public virtual LessonDraft LessonDraft { get; set; }
}