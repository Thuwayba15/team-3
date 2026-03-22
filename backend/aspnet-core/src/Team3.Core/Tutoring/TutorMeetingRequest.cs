using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

namespace Team3.Tutoring;

public class TutorMeetingRequest : FullAuditedEntity<Guid>
{
    public Guid StudentTutorLinkId { get; private set; }

    public long StudentUserId { get; private set; }

    public long TutorUserId { get; private set; }

    public Guid SubjectId { get; private set; }

    public DateTime ScheduledStartUtc { get; private set; }

    public int DurationMinutes { get; private set; }

    public MeetingRequestStatus Status { get; private set; }

    public string? StudentMessage { get; private set; }

    public string? TutorResponseMessage { get; private set; }

    public DateTime? RespondedAtUtc { get; private set; }

    protected TutorMeetingRequest()
    {
    }

    public TutorMeetingRequest(
        Guid id,
        Guid studentTutorLinkId,
        long studentUserId,
        long tutorUserId,
        Guid subjectId,
        DateTime scheduledStartUtc,
        int durationMinutes,
        string? studentMessage)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        StudentTutorLinkId = Guard.Against.Default(studentTutorLinkId);
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId);
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId);
        SubjectId = Guard.Against.Default(subjectId);
        ScheduledStartUtc = scheduledStartUtc;
        DurationMinutes = durationMinutes <= 0 ? 30 : durationMinutes;
        StudentMessage = studentMessage?.Trim();
        Status = MeetingRequestStatus.Pending;
    }

    public void Accept(string? tutorResponseMessage)
    {
        Status = MeetingRequestStatus.Accepted;
        TutorResponseMessage = tutorResponseMessage?.Trim();
        RespondedAtUtc = DateTime.UtcNow;
    }

    public void Decline(string? tutorResponseMessage)
    {
        Status = MeetingRequestStatus.Declined;
        TutorResponseMessage = tutorResponseMessage?.Trim();
        RespondedAtUtc = DateTime.UtcNow;
    }

    public void Cancel()
    {
        Status = MeetingRequestStatus.Cancelled;
        RespondedAtUtc = DateTime.UtcNow;
    }

    public void Complete()
    {
        Status = MeetingRequestStatus.Completed;
    }
}
