using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

namespace Team3.Tutoring;

public class TutorSubjectAssignment : FullAuditedEntity<Guid>
{
    public long TutorUserId { get; private set; }

    public Guid SubjectId { get; private set; }

    public string? Bio { get; private set; }

    public string? Specialization { get; private set; }

    protected TutorSubjectAssignment()
    {
    }

    public TutorSubjectAssignment(Guid id, long tutorUserId, Guid subjectId, string? bio, string? specialization)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId);
        SubjectId = Guard.Against.Default(subjectId);
        Bio = bio?.Trim();
        Specialization = specialization?.Trim();
    }

    public void UpdateAssignment(Guid subjectId, string? bio, string? specialization)
    {
        SubjectId = Guard.Against.Default(subjectId);
        Bio = bio?.Trim();
        Specialization = specialization?.Trim();
    }
}
