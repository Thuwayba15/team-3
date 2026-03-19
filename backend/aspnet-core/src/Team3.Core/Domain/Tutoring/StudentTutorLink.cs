using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Tutoring;

public class StudentTutorLink : FullAuditedEntity<long>
{
    public long StudentUserId { get; private set; }
    public long TutorUserId { get; private set; }
    public DateTime LinkedAt { get; private set; }
    public long? RequestId { get; private set; }

    protected StudentTutorLink()
    {
    }

    public StudentTutorLink(long studentUserId, long tutorUserId, long? requestId = null)
    {
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId, nameof(tutorUserId));
        LinkedAt = DateTime.UtcNow;
        RequestId = requestId;
    }
}
