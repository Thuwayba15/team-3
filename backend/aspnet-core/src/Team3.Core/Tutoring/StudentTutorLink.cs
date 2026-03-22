using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

namespace Team3.Tutoring;

public class StudentTutorLink : FullAuditedEntity<Guid>
{
    public long StudentUserId { get; private set; }

    public long TutorUserId { get; private set; }

    public Guid SubjectId { get; private set; }

    public bool IsActive { get; private set; }

    public DateTime LinkedAtUtc { get; private set; }

    protected StudentTutorLink()
    {
    }

    public StudentTutorLink(Guid id, long studentUserId, long tutorUserId, Guid subjectId)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId);
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId);
        SubjectId = Guard.Against.Default(subjectId);
        IsActive = true;
        LinkedAtUtc = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
    }
}
