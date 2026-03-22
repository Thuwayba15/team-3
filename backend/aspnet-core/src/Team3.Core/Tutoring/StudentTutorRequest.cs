using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

namespace Team3.Tutoring;

public class StudentTutorRequest : FullAuditedEntity<Guid>
{
    public long StudentUserId { get; private set; }

    public long TutorUserId { get; private set; }

    public Guid SubjectId { get; private set; }

    public TutorRequestStatus Status { get; private set; }

    public string? StudentMessage { get; private set; }

    public string? ResponseMessage { get; private set; }

    public DateTime? RespondedAtUtc { get; private set; }

    protected StudentTutorRequest()
    {
    }

    public StudentTutorRequest(Guid id, long studentUserId, long tutorUserId, Guid subjectId, string? studentMessage)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId);
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId);
        SubjectId = Guard.Against.Default(subjectId);
        StudentMessage = studentMessage?.Trim();
        Status = TutorRequestStatus.Pending;
    }

    public void Accept(string? responseMessage)
    {
        Status = TutorRequestStatus.Accepted;
        ResponseMessage = responseMessage?.Trim();
        RespondedAtUtc = DateTime.UtcNow;
    }

    public void Decline(string? responseMessage)
    {
        Status = TutorRequestStatus.Declined;
        ResponseMessage = responseMessage?.Trim();
        RespondedAtUtc = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = TutorRequestStatus.Cancelled;
        RespondedAtUtc = DateTime.UtcNow;
    }
}
