using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Parents;

/// <summary>
/// Tracks a student's mastery score for a single curriculum topic.
/// </summary>
public class StudentTopicProgress : FullAuditedEntity<long>
{
    public long     StudentUserId  { get; private set; }
    public Guid     SubjectId      { get; private set; }
    public Guid     TopicId        { get; private set; }

    /// <summary>Mastery score as a percentage 0–100.</summary>
    public int      MasteryScore    { get; private set; }
    public DateTime LastAttemptedAt { get; private set; }

    protected StudentTopicProgress() { }

    public StudentTopicProgress(
        long     studentUserId,
        Guid     subjectId,
        Guid     topicId,
        int      masteryScore,
        DateTime lastAttemptedAt)
    {
        StudentUserId  = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        SubjectId      = subjectId;
        TopicId        = topicId;
        MasteryScore    = Guard.Against.OutOfRange(masteryScore, nameof(masteryScore), 0, 100);
        LastAttemptedAt = lastAttemptedAt;
    }

    public void UpdateScore(int masteryScore, DateTime attemptedAt)
    {
        MasteryScore    = Guard.Against.OutOfRange(masteryScore, nameof(masteryScore), 0, 100);
        LastAttemptedAt = attemptedAt;
    }
}
