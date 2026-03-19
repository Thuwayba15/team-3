using System;
using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;

namespace Team3.Domain.Tutoring;

public class StudentTutorRequest : FullAuditedEntity<long>
{
    public long StudentUserId { get; private set; }
    public long TutorUserId { get; private set; }
    public StudentTutorRequestStatus Status { get; private set; }
    public DateTime RequestedAt { get; private set; }
    public DateTime? RespondedAt { get; private set; }
    public long? RespondedByUserId { get; private set; }

    protected StudentTutorRequest()
    {
    }

    public StudentTutorRequest(long studentUserId, long tutorUserId)
    {
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId, nameof(studentUserId));
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId, nameof(tutorUserId));
        Status = StudentTutorRequestStatus.Pending;
        RequestedAt = DateTime.UtcNow;
    }

    public void Accept(long respondedByUserId)
    {
        EnsurePending();
        Status = StudentTutorRequestStatus.Accepted;
        RespondedAt = DateTime.UtcNow;
        RespondedByUserId = Guard.Against.NegativeOrZero(respondedByUserId, nameof(respondedByUserId));
    }

    public void Decline(long respondedByUserId)
    {
        EnsurePending();
        Status = StudentTutorRequestStatus.Declined;
        RespondedAt = DateTime.UtcNow;
        RespondedByUserId = Guard.Against.NegativeOrZero(respondedByUserId, nameof(respondedByUserId));
    }

    private void EnsurePending()
    {
        if (Status != StudentTutorRequestStatus.Pending)
        {
            throw new InvalidOperationException("Only pending tutor requests can be updated.");
        }
    }
}
