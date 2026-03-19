using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Parents;

/// <summary>
/// Records a single learning activity performed by a student (quiz, lesson, AI chat, etc.).
/// </summary>
public class StudentActivityLog : FullAuditedEntity<long>
{
    public long         StudentUserId   { get; private set; }
    public ActivityType ActivityType    { get; private set; }
    public string       Title           { get; private set; } = default!;
    public Guid?        SubjectId       { get; private set; }
    public int?         Score           { get; private set; }   // 0-100, null if not scored
    public int          DurationMinutes { get; private set; }   // time spent on this activity
    public DateTime     OccurredAt      { get; private set; }

    protected StudentActivityLog() { }

    public StudentActivityLog(
        long         studentUserId,
        ActivityType activityType,
        string       title,
        DateTime     occurredAt,
        int          durationMinutes = 0,
        Guid?        subjectId       = null,
        int?         score           = null)
    {
        StudentUserId   = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        ActivityType    = activityType;
        Title           = Guard.Against.NullOrWhiteSpace(title).Trim();
        OccurredAt      = occurredAt;
        DurationMinutes = Guard.Against.Negative(durationMinutes, nameof(durationMinutes));
        SubjectId       = subjectId;
        Score           = score;
    }
}
