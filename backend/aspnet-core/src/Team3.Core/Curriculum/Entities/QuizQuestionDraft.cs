using Abp.Domain.Entities.Auditing;
using System.ComponentModel.DataAnnotations;
using Team3.Curriculum.Enums;

namespace Team3.Curriculum.Entities;

/// <summary>
/// Draft MCQ for a quiz.
/// </summary>
public class QuizQuestionDraft : FullAuditedEntity<long>
{
    public long QuizDraftId { get; set; }

    [Required]
    [StringLength(1000)]
    public string QuestionText { get; set; }

    [StringLength(500)]
    public string OptionA { get; set; }

    [StringLength(500)]
    public string OptionB { get; set; }

    [StringLength(500)]
    public string OptionC { get; set; }

    [StringLength(500)]
    public string OptionD { get; set; }

    [Required]
    [StringLength(1)]
    public string CorrectAnswer { get; set; } // A, B, C, D

    [StringLength(1000)]
    public string Explanation { get; set; }

    public int Order { get; set; }

    public DraftStatus Status { get; set; }

    // Navigation
    public virtual QuizDraft QuizDraft { get; set; }
}