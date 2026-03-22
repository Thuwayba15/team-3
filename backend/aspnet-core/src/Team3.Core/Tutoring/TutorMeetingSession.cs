using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

namespace Team3.Tutoring;

public class TutorMeetingSession : FullAuditedEntity<Guid>
{
    public Guid MeetingRequestId { get; private set; }

    public long StudentUserId { get; private set; }

    public long TutorUserId { get; private set; }

    public Guid SubjectId { get; private set; }

    public MeetingSessionStatus Status { get; private set; }

    public DateTime? StartedAtUtc { get; private set; }

    public DateTime? EndedAtUtc { get; private set; }

    protected TutorMeetingSession()
    {
    }

    public TutorMeetingSession(Guid id, Guid meetingRequestId, long studentUserId, long tutorUserId, Guid subjectId)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        MeetingRequestId = Guard.Against.Default(meetingRequestId);
        StudentUserId = Guard.Against.NegativeOrZero(studentUserId);
        TutorUserId = Guard.Against.NegativeOrZero(tutorUserId);
        SubjectId = Guard.Against.Default(subjectId);
        Status = MeetingSessionStatus.Scheduled;
    }

    public void Start()
    {
        Status = MeetingSessionStatus.Live;
        StartedAtUtc ??= DateTime.UtcNow;
    }

    public void End()
    {
        Status = MeetingSessionStatus.Ended;
        EndedAtUtc = DateTime.UtcNow;
    }
}
