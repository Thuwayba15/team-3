using System;

namespace Team3.Services.Tutoring.Dto;

public class TutorListItemDto
{
    public long TutorUserId { get; set; }
    public string FullName { get; set; } = default!;
    public string Initials { get; set; } = default!;
    public string? Specialization { get; set; }
    public string? Bio { get; set; }
    public string? SubjectInterests { get; set; }
    public bool HasPendingRequest { get; set; }
}

public class RequestTutorInput
{
    public long TutorUserId { get; set; }
}

public class RespondToTutorRequestInput
{
    public long RequestId { get; set; }
    public bool Accept { get; set; }
}

public class TutorRequestDto
{
    public long RequestId { get; set; }
    public long StudentUserId { get; set; }
    public string StudentName { get; set; } = default!;
    public string StudentInitials { get; set; } = default!;
    public string? StudentGradeLevel { get; set; }
    public long TutorUserId { get; set; }
    public string TutorName { get; set; } = default!;
    public string TutorInitials { get; set; } = default!;
    public string? TutorSpecialization { get; set; }
    public string Status { get; set; } = default!;
    public DateTime RequestedAt { get; set; }
    public DateTime? RespondedAt { get; set; }
}

public class StudentTutorLinkDto
{
    public long TutorUserId { get; set; }
    public string TutorName { get; set; } = default!;
    public string TutorInitials { get; set; } = default!;
    public string? TutorSpecialization { get; set; }
    public string? TutorBio { get; set; }
    public DateTime LinkedAt { get; set; }
}

public class TutorStudentLinkDto
{
    public long StudentUserId { get; set; }
    public string StudentName { get; set; } = default!;
    public string StudentInitials { get; set; } = default!;
    public string? GradeLevel { get; set; }
    public DateTime LinkedAt { get; set; }
}
