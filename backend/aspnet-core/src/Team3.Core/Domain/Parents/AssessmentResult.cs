using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Parents;

/// <summary>
/// Records the outcome of a quiz, test, or assignment for a student on a specific topic.
/// </summary>
public class AssessmentResult : FullAuditedEntity<long>
{
    public long           StudentUserId  { get; private set; }
    public Guid           SubjectId      { get; private set; }
    public Guid           TopicId        { get; private set; }
    public string         Title          { get; private set; } = default!;
    public AssessmentType AssessmentType { get; private set; }

    /// <summary>Score as a percentage 0–100.</summary>
    public int      Score      { get; private set; }
    public DateTime OccurredAt { get; private set; }

    protected AssessmentResult() { }

    public AssessmentResult(
        long           studentUserId,
        Guid           subjectId,
        Guid           topicId,
        string         title,
        AssessmentType assessmentType,
        int            score,
        DateTime       occurredAt)
    {
        StudentUserId  = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        SubjectId      = subjectId;
        TopicId        = topicId;
        Title          = Guard.Against.NullOrWhiteSpace(title).Trim();
        AssessmentType = assessmentType;
        Score          = Guard.Against.OutOfRange(score, nameof(score), 0, 100);
        OccurredAt     = occurredAt;
    }
}
