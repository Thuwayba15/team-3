using System;
using System.Collections.Generic;

namespace Team3.Tutoring.Dto;

public class TutorSetupStatusDto
{
    public bool IsComplete { get; set; }

    public Guid? SubjectId { get; set; }

    public string? SubjectName { get; set; }

    public string? Bio { get; set; }

    public string? Specialization { get; set; }
}

public class TutorSubjectOptionDto
{
    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = default!;

    public string? GradeLevel { get; set; }
}

public class CompleteTutorSetupInput
{
    public Guid SubjectId { get; set; }

    public string? Bio { get; set; }

    public string? Specialization { get; set; }
}

public class AvailableTutorDto
{
    public long TutorUserId { get; set; }

    public string TutorName { get; set; } = default!;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = default!;

    public string? Bio { get; set; }

    public string? Specialization { get; set; }

    public bool HasPendingRequest { get; set; }

    public bool IsLinked { get; set; }
}

public class RequestTutorInput
{
    public long TutorUserId { get; set; }

    public Guid SubjectId { get; set; }

    public string? Message { get; set; }
}

public class TutorRequestDto
{
    public Guid RequestId { get; set; }

    public long StudentUserId { get; set; }

    public long TutorUserId { get; set; }

    public string StudentName { get; set; } = default!;

    public string TutorName { get; set; } = default!;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = default!;

    public string Status { get; set; } = default!;

    public string? Message { get; set; }

    public string? ResponseMessage { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? RespondedAtUtc { get; set; }
}

public class LinkedTutorDto
{
    public Guid LinkId { get; set; }

    public long TutorUserId { get; set; }

    public string TutorName { get; set; } = default!;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = default!;

    public string? Bio { get; set; }

    public string? Specialization { get; set; }

    public DateTime LinkedAtUtc { get; set; }
}

public class RequestMeetingInput
{
    public Guid LinkId { get; set; }

    public DateTime ScheduledStartUtc { get; set; }

    public int DurationMinutes { get; set; } = 30;

    public string? Message { get; set; }
}

public class MeetingRequestDto
{
    public Guid MeetingRequestId { get; set; }

    public Guid LinkId { get; set; }

    public long StudentUserId { get; set; }

    public long TutorUserId { get; set; }

    public string StudentName { get; set; } = default!;

    public string TutorName { get; set; } = default!;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = default!;

    public DateTime ScheduledStartUtc { get; set; }

    public int DurationMinutes { get; set; }

    public string Status { get; set; } = default!;

    public string? StudentMessage { get; set; }

    public string? TutorResponseMessage { get; set; }

    public Guid? MeetingSessionId { get; set; }

    public bool CanJoin { get; set; }
}

public class RespondToTutorRequestInput
{
    public Guid RequestId { get; set; }

    public bool Accept { get; set; }

    public string? ResponseMessage { get; set; }
}

public class RespondToMeetingRequestInput
{
    public Guid MeetingRequestId { get; set; }

    public bool Accept { get; set; }

    public string? ResponseMessage { get; set; }
}

public class TutorDashboardDto
{
    public int LinkedStudentsCount { get; set; }

    public int PendingTutorRequestsCount { get; set; }

    public int PendingMeetingRequestsCount { get; set; }

    public int UpcomingMeetingsCount { get; set; }

    public decimal AverageStudentMasteryScore { get; set; }

    public List<TutorRequestDto> PendingTutorRequests { get; set; } = [];

    public List<MeetingRequestDto> UpcomingMeetings { get; set; } = [];

    public List<TutorStudentStatDto> StudentsNeedingAttention { get; set; } = [];
}

public class TutorStudentStatDto
{
    public long StudentUserId { get; set; }

    public string StudentName { get; set; } = default!;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = default!;

    public decimal MasteryScore { get; set; }

    public bool NeedsIntervention { get; set; }
}

public class MeetingAccessDto
{
    public Guid MeetingRequestId { get; set; }

    public Guid MeetingSessionId { get; set; }

    public string SubjectName { get; set; } = default!;

    public string OtherParticipantName { get; set; } = default!;

    public bool IsTutor { get; set; }

    public bool CanJoin { get; set; }

    public string HubUrl { get; set; } = "/signalr/meetings";
}
