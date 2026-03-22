using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Application.Localization;
using Team3.Authorization.Users;
using Team3.Configuration;
using Team3.Tutoring.Dto;

namespace Team3.Tutoring;

[AbpAuthorize]
public class TutorPortalAppService : Team3AppServiceBase, ITutorPortalAppService
{
    private readonly IRepository<User, long> _userRepository;
    private readonly IRepository<Subject, Guid> _subjectRepository;
    private readonly IRepository<SubjectTranslation, Guid> _subjectTranslationRepository;
    private readonly IRepository<Language, Guid> _languageRepository;
    private readonly IRepository<TutorSubjectAssignment, Guid> _assignmentRepository;
    private readonly IRepository<StudentTutorRequest, Guid> _requestRepository;
    private readonly IRepository<StudentTutorLink, Guid> _linkRepository;
    private readonly IRepository<TutorMeetingRequest, Guid> _meetingRequestRepository;
    private readonly IRepository<TutorMeetingSession, Guid> _meetingSessionRepository;
    private readonly IRepository<StudentProgress, Guid> _studentProgressRepository;
    private readonly ILanguageResolver _languageResolver;

    public TutorPortalAppService(
        IRepository<User, long> userRepository,
        IRepository<Subject, Guid> subjectRepository,
        IRepository<SubjectTranslation, Guid> subjectTranslationRepository,
        IRepository<Language, Guid> languageRepository,
        IRepository<TutorSubjectAssignment, Guid> assignmentRepository,
        IRepository<StudentTutorRequest, Guid> requestRepository,
        IRepository<StudentTutorLink, Guid> linkRepository,
        IRepository<TutorMeetingRequest, Guid> meetingRequestRepository,
        IRepository<TutorMeetingSession, Guid> meetingSessionRepository,
        IRepository<StudentProgress, Guid> studentProgressRepository,
        ILanguageResolver languageResolver)
    {
        _userRepository = userRepository;
        _subjectRepository = subjectRepository;
        _subjectTranslationRepository = subjectTranslationRepository;
        _languageRepository = languageRepository;
        _assignmentRepository = assignmentRepository;
        _requestRepository = requestRepository;
        _linkRepository = linkRepository;
        _meetingRequestRepository = meetingRequestRepository;
        _meetingSessionRepository = meetingSessionRepository;
        _studentProgressRepository = studentProgressRepository;
        _languageResolver = languageResolver;
    }

    public async Task<TutorSetupStatusDto> GetSetupStatusAsync()
    {
        var tutorUserId = await EnsureTutorAsync();
        var assignment = await _assignmentRepository.FirstOrDefaultAsync(x => x.TutorUserId == tutorUserId);

        if (assignment == null)
        {
            return new TutorSetupStatusDto { IsComplete = false };
        }

        var subjectNameMap = await BuildSubjectNameMapAsync([assignment.SubjectId], await _languageResolver.GetUserPreferredLanguageCodeAsync(tutorUserId));
        return new TutorSetupStatusDto
        {
            IsComplete = true,
            SubjectId = assignment.SubjectId,
            SubjectName = subjectNameMap.GetValueOrDefault(assignment.SubjectId, "Subject"),
            Bio = assignment.Bio,
            Specialization = assignment.Specialization,
        };
    }

    public async Task<List<TutorSubjectOptionDto>> GetAvailableSubjectsAsync()
    {
        var tutorUserId = await EnsureTutorAsync();
        var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(tutorUserId);
        var subjects = await _subjectRepository.GetAll()
            .Where(x => x.IsActive)
            .OrderBy(x => x.Name)
            .ToListAsync();
        var subjectNameMap = await BuildSubjectNameMapAsync(subjects.Select(x => x.Id), languageCode);

        return subjects.Select(subject => new TutorSubjectOptionDto
        {
            SubjectId = subject.Id,
            SubjectName = subjectNameMap.GetValueOrDefault(subject.Id, subject.Name),
            GradeLevel = subject.GradeLevel,
        }).ToList();
    }

    public async Task<TutorSetupStatusDto> CompleteSetupAsync(CompleteTutorSetupInput input)
    {
        var tutorUserId = await EnsureTutorAsync();
        var subject = await _subjectRepository.FirstOrDefaultAsync(input.SubjectId)
            ?? throw new UserFriendlyException("Subject not found.");

        var assignment = await _assignmentRepository.FirstOrDefaultAsync(x => x.TutorUserId == tutorUserId);
        if (assignment == null)
        {
            assignment = new TutorSubjectAssignment(Guid.NewGuid(), tutorUserId, subject.Id, input.Bio, input.Specialization);
            await _assignmentRepository.InsertAsync(assignment);
        }
        else
        {
            assignment.UpdateAssignment(subject.Id, input.Bio, input.Specialization);
            await _assignmentRepository.UpdateAsync(assignment);
        }

        await CurrentUnitOfWork.SaveChangesAsync();
        var subjectNameMap = await BuildSubjectNameMapAsync([subject.Id], await _languageResolver.GetUserPreferredLanguageCodeAsync(tutorUserId));

        return new TutorSetupStatusDto
        {
            IsComplete = true,
            SubjectId = subject.Id,
            SubjectName = subjectNameMap.GetValueOrDefault(subject.Id, subject.Name),
            Bio = assignment.Bio,
            Specialization = assignment.Specialization,
        };
    }

    public async Task<TutorDashboardDto> GetDashboardAsync()
    {
        var tutorUserId = await EnsureTutorAsync();
        var links = await _linkRepository.GetAll()
            .Where(x => x.TutorUserId == tutorUserId && x.IsActive)
            .ToListAsync();

        var studentIds = links.Select(x => x.StudentUserId).Distinct().ToList();
        var subjectIds = links.Select(x => x.SubjectId).Distinct().ToList();
        var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(tutorUserId);
        var subjectNameMap = await BuildSubjectNameMapAsync(subjectIds, languageCode);
        var students = await _userRepository.GetAll().Where(x => studentIds.Contains(x.Id)).ToListAsync();
        var progressRecords = await _studentProgressRepository.GetAll()
            .Where(x => studentIds.Contains(x.StudentId) && subjectIds.Contains(x.SubjectId))
            .ToListAsync();

        var pendingTutorRequests = await _requestRepository.GetAll()
            .Where(x => x.TutorUserId == tutorUserId && x.Status == TutorRequestStatus.Pending)
            .OrderByDescending(x => x.CreationTime)
            .ToListAsync();

        var meetingRequests = await _meetingRequestRepository.GetAll()
            .Where(x => x.TutorUserId == tutorUserId)
            .OrderBy(x => x.ScheduledStartUtc)
            .ToListAsync();

        var dashboard = new TutorDashboardDto
        {
            LinkedStudentsCount = studentIds.Count,
            PendingTutorRequestsCount = pendingTutorRequests.Count,
            PendingMeetingRequestsCount = meetingRequests.Count(x => x.Status == MeetingRequestStatus.Pending),
            UpcomingMeetingsCount = meetingRequests.Count(x => x.Status == MeetingRequestStatus.Accepted),
            AverageStudentMasteryScore = progressRecords.Count == 0 ? 0m : Math.Round(progressRecords.Average(x => x.MasteryScore), 0),
        };

        foreach (var request in pendingTutorRequests.Take(5))
        {
            dashboard.PendingTutorRequests.Add(await MapTutorRequestAsync(request, tutorUserId));
        }

        foreach (var request in meetingRequests.Where(x => x.Status == MeetingRequestStatus.Accepted).Take(5))
        {
            dashboard.UpcomingMeetings.Add(await MapMeetingRequestAsync(request, tutorUserId));
        }

        dashboard.StudentsNeedingAttention = progressRecords
            .Where(x => x.NeedsIntervention || x.MasteryScore < 60m)
            .OrderBy(x => x.MasteryScore)
            .Take(5)
            .Select(record =>
            {
                var student = students.FirstOrDefault(x => x.Id == record.StudentId);
                return new TutorStudentStatDto
                {
                    StudentUserId = record.StudentId,
                    StudentName = student == null ? "Student" : BuildDisplayName(student),
                    SubjectId = record.SubjectId,
                    SubjectName = subjectNameMap.GetValueOrDefault(record.SubjectId, "Subject"),
                    MasteryScore = record.MasteryScore,
                    NeedsIntervention = record.NeedsIntervention,
                };
            })
            .ToList();

        return dashboard;
    }

    public async Task<List<TutorRequestDto>> GetStudentRequestsAsync()
    {
        var tutorUserId = await EnsureTutorAsync();
        var requests = await _requestRepository.GetAll()
            .Where(x => x.TutorUserId == tutorUserId)
            .OrderByDescending(x => x.CreationTime)
            .ToListAsync();

        var output = new List<TutorRequestDto>();
        foreach (var request in requests)
        {
            output.Add(await MapTutorRequestAsync(request, tutorUserId));
        }

        return output;
    }

    public async Task<TutorRequestDto> RespondToStudentRequestAsync(RespondToTutorRequestInput input)
    {
        var tutorUserId = await EnsureTutorAsync();
        var request = await _requestRepository.FirstOrDefaultAsync(x => x.Id == input.RequestId && x.TutorUserId == tutorUserId)
            ?? throw new UserFriendlyException("Tutor request not found.");

        if (request.Status != TutorRequestStatus.Pending)
        {
            throw new UserFriendlyException("This tutor request has already been handled.");
        }

        if (input.Accept)
        {
            request.Accept(input.ResponseMessage);

            var existingLinks = await _linkRepository.GetAll()
                .Where(x => x.StudentUserId == request.StudentUserId && x.SubjectId == request.SubjectId && x.IsActive)
                .ToListAsync();

            foreach (var existingLink in existingLinks)
            {
                existingLink.Deactivate();
                await _linkRepository.UpdateAsync(existingLink);
            }

            await _linkRepository.InsertAsync(new StudentTutorLink(Guid.NewGuid(), request.StudentUserId, request.TutorUserId, request.SubjectId));
        }
        else
        {
            request.Decline(input.ResponseMessage);
        }

        await _requestRepository.UpdateAsync(request);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await MapTutorRequestAsync(request, tutorUserId);
    }

    public async Task<List<MeetingRequestDto>> GetMeetingsAsync()
    {
        var tutorUserId = await EnsureTutorAsync();
        var requests = await _meetingRequestRepository.GetAll()
            .Where(x => x.TutorUserId == tutorUserId)
            .OrderByDescending(x => x.ScheduledStartUtc)
            .ToListAsync();

        var output = new List<MeetingRequestDto>();
        foreach (var request in requests)
        {
            output.Add(await MapMeetingRequestAsync(request, tutorUserId));
        }

        return output;
    }

    public async Task<MeetingRequestDto> RespondToMeetingRequestAsync(RespondToMeetingRequestInput input)
    {
        var tutorUserId = await EnsureTutorAsync();
        var request = await _meetingRequestRepository.FirstOrDefaultAsync(x => x.Id == input.MeetingRequestId && x.TutorUserId == tutorUserId)
            ?? throw new UserFriendlyException("Meeting request not found.");

        if (request.Status != MeetingRequestStatus.Pending)
        {
            throw new UserFriendlyException("This meeting request has already been handled.");
        }

        if (input.Accept)
        {
            request.Accept(input.ResponseMessage);

            var session = await _meetingSessionRepository.FirstOrDefaultAsync(x => x.MeetingRequestId == request.Id);
            if (session == null)
            {
                await _meetingSessionRepository.InsertAsync(new TutorMeetingSession(Guid.NewGuid(), request.Id, request.StudentUserId, request.TutorUserId, request.SubjectId));
            }
        }
        else
        {
            request.Decline(input.ResponseMessage);
        }

        await _meetingRequestRepository.UpdateAsync(request);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await MapMeetingRequestAsync(request, tutorUserId);
    }

    public async Task<MeetingAccessDto> StartMeetingAsync(Guid meetingRequestId)
    {
        var tutorUserId = await EnsureTutorAsync();
        var request = await _meetingRequestRepository.FirstOrDefaultAsync(x => x.Id == meetingRequestId && x.TutorUserId == tutorUserId)
            ?? throw new UserFriendlyException("Meeting request not found.");

        if (request.Status != MeetingRequestStatus.Accepted)
        {
            throw new UserFriendlyException("Meeting has not been accepted.");
        }

        var session = await _meetingSessionRepository.FirstOrDefaultAsync(x => x.MeetingRequestId == request.Id);
        if (session == null)
        {
            session = new TutorMeetingSession(Guid.NewGuid(), request.Id, request.StudentUserId, request.TutorUserId, request.SubjectId);
            await _meetingSessionRepository.InsertAsync(session);
        }

        session.Start();
        await _meetingSessionRepository.UpdateAsync(session);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await BuildMeetingAccessAsync(request, session, tutorUserId, true);
    }

    public async Task<MeetingAccessDto> GetMeetingAccessAsync(Guid meetingRequestId)
    {
        var tutorUserId = await EnsureTutorAsync();
        var request = await _meetingRequestRepository.FirstOrDefaultAsync(x => x.Id == meetingRequestId && x.TutorUserId == tutorUserId)
            ?? throw new UserFriendlyException("Meeting request not found.");

        if (request.Status != MeetingRequestStatus.Accepted && request.Status != MeetingRequestStatus.Completed)
        {
            throw new UserFriendlyException("Meeting is not available.");
        }

        var session = await _meetingSessionRepository.FirstOrDefaultAsync(x => x.MeetingRequestId == request.Id)
            ?? throw new UserFriendlyException("Meeting session is not available.");

        return await BuildMeetingAccessAsync(request, session, tutorUserId, true);
    }

    private async Task<long> EnsureTutorAsync()
    {
        var user = await GetCurrentUserAsync();
        var roles = await UserManager.GetRolesAsync(user);
        if (!roles.Any(role => string.Equals(role, UserRoleNames.Tutor, StringComparison.OrdinalIgnoreCase)))
        {
            throw new AbpAuthorizationException("Only tutors can access this resource.");
        }

        return user.Id;
    }

    private async Task<TutorRequestDto> MapTutorRequestAsync(StudentTutorRequest request, long viewerUserId)
    {
        var student = await _userRepository.GetAsync(request.StudentUserId);
        var tutor = await _userRepository.GetAsync(request.TutorUserId);
        var subjectNameMap = await BuildSubjectNameMapAsync([request.SubjectId], await _languageResolver.GetUserPreferredLanguageCodeAsync(viewerUserId));

        return new TutorRequestDto
        {
            RequestId = request.Id,
            StudentUserId = request.StudentUserId,
            TutorUserId = request.TutorUserId,
            StudentName = BuildDisplayName(student),
            TutorName = BuildDisplayName(tutor),
            SubjectId = request.SubjectId,
            SubjectName = subjectNameMap.GetValueOrDefault(request.SubjectId, "Subject"),
            Status = request.Status.ToString(),
            Message = request.StudentMessage,
            ResponseMessage = request.ResponseMessage,
            CreatedAt = request.CreationTime,
            RespondedAtUtc = request.RespondedAtUtc,
        };
    }

    private async Task<MeetingRequestDto> MapMeetingRequestAsync(TutorMeetingRequest request, long viewerUserId)
    {
        var student = await _userRepository.GetAsync(request.StudentUserId);
        var tutor = await _userRepository.GetAsync(request.TutorUserId);
        var session = await _meetingSessionRepository.FirstOrDefaultAsync(x => x.MeetingRequestId == request.Id);
        var subjectNameMap = await BuildSubjectNameMapAsync([request.SubjectId], await _languageResolver.GetUserPreferredLanguageCodeAsync(viewerUserId));

        return new MeetingRequestDto
        {
            MeetingRequestId = request.Id,
            LinkId = request.StudentTutorLinkId,
            StudentUserId = request.StudentUserId,
            TutorUserId = request.TutorUserId,
            StudentName = BuildDisplayName(student),
            TutorName = BuildDisplayName(tutor),
            SubjectId = request.SubjectId,
            SubjectName = subjectNameMap.GetValueOrDefault(request.SubjectId, "Subject"),
            ScheduledStartUtc = request.ScheduledStartUtc,
            DurationMinutes = request.DurationMinutes,
            Status = request.Status.ToString(),
            StudentMessage = request.StudentMessage,
            TutorResponseMessage = request.TutorResponseMessage,
            MeetingSessionId = session?.Id,
            CanJoin = request.Status == MeetingRequestStatus.Accepted && session != null,
        };
    }

    private async Task<MeetingAccessDto> BuildMeetingAccessAsync(
        TutorMeetingRequest request,
        TutorMeetingSession session,
        long viewerUserId,
        bool isTutor)
    {
        var otherUser = await _userRepository.GetAsync(isTutor ? request.StudentUserId : request.TutorUserId);
        var subjectNameMap = await BuildSubjectNameMapAsync([request.SubjectId], await _languageResolver.GetUserPreferredLanguageCodeAsync(viewerUserId));

        return new MeetingAccessDto
        {
            MeetingRequestId = request.Id,
            MeetingSessionId = session.Id,
            SubjectName = subjectNameMap.GetValueOrDefault(request.SubjectId, "Subject"),
            OtherParticipantName = BuildDisplayName(otherUser),
            IsTutor = isTutor,
            CanJoin = request.Status == MeetingRequestStatus.Accepted,
        };
    }

    private async Task<Dictionary<Guid, string>> BuildSubjectNameMapAsync(IEnumerable<Guid> subjectIds, string languageCode)
    {
        var ids = subjectIds.Distinct().ToList();
        var subjects = await _subjectRepository.GetAll().Where(x => ids.Contains(x.Id)).ToListAsync();
        var translations = await _subjectTranslationRepository.GetAll().Where(x => ids.Contains(x.SubjectId)).ToListAsync();
        var languages = await _languageRepository.GetAll().ToListAsync();
        var languageCodeToId = languages.ToDictionary(x => x.Code.ToLowerInvariant(), x => x.Id);

        var result = new Dictionary<Guid, string>();
        foreach (var subject in subjects)
        {
            result[subject.Id] = ResolveSubjectName(subject, translations, languageCodeToId, languageCode);
        }

        return result;
    }

    private static string ResolveSubjectName(
        Subject subject,
        List<SubjectTranslation> translations,
        Dictionary<string, Guid> languageCodeToId,
        string languageCode)
    {
        if (languageCodeToId.TryGetValue(languageCode.ToLowerInvariant(), out var preferredLanguageId))
        {
            var preferred = translations.FirstOrDefault(x => x.SubjectId == subject.Id && x.LanguageId == preferredLanguageId);
            if (!string.IsNullOrWhiteSpace(preferred?.Name))
            {
                return preferred.Name;
            }
        }

        if (languageCodeToId.TryGetValue("en", out var englishLanguageId))
        {
            var english = translations.FirstOrDefault(x => x.SubjectId == subject.Id && x.LanguageId == englishLanguageId);
            if (!string.IsNullOrWhiteSpace(english?.Name))
            {
                return english.Name;
            }
        }

        return subject.Name;
    }

    private static string BuildDisplayName(User user)
    {
        var fullName = $"{user.Name} {user.Surname}".Trim();
        return string.IsNullOrWhiteSpace(fullName) ? user.UserName : fullName;
    }
}
