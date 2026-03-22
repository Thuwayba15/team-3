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
public class StudentTutorAppService : Team3AppServiceBase, IStudentTutorAppService
{
    private readonly IRepository<User, long> _userRepository;
    private readonly IRepository<Subject, Guid> _subjectRepository;
    private readonly IRepository<SubjectTranslation, Guid> _subjectTranslationRepository;
    private readonly IRepository<Language, Guid> _languageRepository;
    private readonly IRepository<StudentEnrollment, Guid> _enrollmentRepository;
    private readonly IRepository<TutorSubjectAssignment, Guid> _assignmentRepository;
    private readonly IRepository<StudentTutorRequest, Guid> _requestRepository;
    private readonly IRepository<StudentTutorLink, Guid> _linkRepository;
    private readonly IRepository<TutorMeetingRequest, Guid> _meetingRequestRepository;
    private readonly IRepository<TutorMeetingSession, Guid> _meetingSessionRepository;
    private readonly ILanguageResolver _languageResolver;

    public StudentTutorAppService(
        IRepository<User, long> userRepository,
        IRepository<Subject, Guid> subjectRepository,
        IRepository<SubjectTranslation, Guid> subjectTranslationRepository,
        IRepository<Language, Guid> languageRepository,
        IRepository<StudentEnrollment, Guid> enrollmentRepository,
        IRepository<TutorSubjectAssignment, Guid> assignmentRepository,
        IRepository<StudentTutorRequest, Guid> requestRepository,
        IRepository<StudentTutorLink, Guid> linkRepository,
        IRepository<TutorMeetingRequest, Guid> meetingRequestRepository,
        IRepository<TutorMeetingSession, Guid> meetingSessionRepository,
        ILanguageResolver languageResolver)
    {
        _userRepository = userRepository;
        _subjectRepository = subjectRepository;
        _subjectTranslationRepository = subjectTranslationRepository;
        _languageRepository = languageRepository;
        _enrollmentRepository = enrollmentRepository;
        _assignmentRepository = assignmentRepository;
        _requestRepository = requestRepository;
        _linkRepository = linkRepository;
        _meetingRequestRepository = meetingRequestRepository;
        _meetingSessionRepository = meetingSessionRepository;
        _languageResolver = languageResolver;
    }

    public async Task<List<AvailableTutorDto>> GetAvailableTutorsAsync(Guid? subjectId = null)
    {
        var studentId = await EnsureStudentAsync();
        var enrolledSubjectIds = await _enrollmentRepository.GetAll()
            .AsNoTracking()
            .Where(x => x.StudentId == studentId && x.IsActive)
            .Select(x => x.SubjectId)
            .ToListAsync();

        var effectiveSubjectIds = subjectId.HasValue
            ? enrolledSubjectIds.Where(id => id == subjectId.Value).ToList()
            : enrolledSubjectIds;

        if (effectiveSubjectIds.Count == 0)
        {
            return [];
        }

        var assignments = await _assignmentRepository.GetAll()
            .AsNoTracking()
            .Where(x => effectiveSubjectIds.Contains(x.SubjectId))
            .ToListAsync();

        if (assignments.Count == 0)
        {
            return [];
        }

        var tutorIds = assignments.Select(x => x.TutorUserId).Distinct().ToList();
        var subjectIds = assignments.Select(x => x.SubjectId).Distinct().ToList();
        var tutors = await _userRepository.GetAll()
            .AsNoTracking()
            .Where(x => tutorIds.Contains(x.Id) && x.IsActive)
            .ToListAsync();

        var activeLinks = await _linkRepository.GetAll()
            .AsNoTracking()
            .Where(x => x.StudentUserId == studentId && x.IsActive)
            .ToListAsync();

        var pendingRequests = await _requestRepository.GetAll()
            .AsNoTracking()
            .Where(x => x.StudentUserId == studentId && x.Status == TutorRequestStatus.Pending)
            .ToListAsync();

        var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(studentId);
        var subjectNameMap = await BuildSubjectNameMapAsync(subjectIds, languageCode);

        var tutorNameById = tutors.ToDictionary(x => x.Id, BuildDisplayName);
        var activeLinkKeys = activeLinks.Select(x => $"{x.TutorUserId}:{x.SubjectId}").ToHashSet();
        var pendingRequestKeys = pendingRequests.Select(x => $"{x.TutorUserId}:{x.SubjectId}").ToHashSet();

        return assignments
            .Where(assignment => tutorNameById.ContainsKey(assignment.TutorUserId))
            .Select(assignment =>
            {
                var requestKey = $"{assignment.TutorUserId}:{assignment.SubjectId}";

                return new AvailableTutorDto
                {
                    TutorUserId = assignment.TutorUserId,
                    TutorName = tutorNameById[assignment.TutorUserId],
                    SubjectId = assignment.SubjectId,
                    SubjectName = subjectNameMap.GetValueOrDefault(assignment.SubjectId, "Subject"),
                    Bio = assignment.Bio,
                    Specialization = assignment.Specialization,
                    HasPendingRequest = pendingRequestKeys.Contains(requestKey),
                    IsLinked = activeLinkKeys.Contains(requestKey),
                };
            })
            .OrderBy(x => x.TutorName)
            .ToList();
    }

    public async Task<TutorRequestDto> RequestTutorAsync(RequestTutorInput input)
    {
        var studentId = await EnsureStudentAsync();
        await EnsureStudentEnrolledAsync(studentId, input.SubjectId);

        var assignment = await _assignmentRepository.FirstOrDefaultAsync(x => x.TutorUserId == input.TutorUserId && x.SubjectId == input.SubjectId)
            ?? throw new UserFriendlyException("Tutor is not available for this subject.");

        var activeLink = await _linkRepository.FirstOrDefaultAsync(x =>
            x.StudentUserId == studentId &&
            x.TutorUserId == input.TutorUserId &&
            x.SubjectId == input.SubjectId &&
            x.IsActive);

        if (activeLink != null)
        {
            throw new UserFriendlyException("You are already linked to this tutor for the subject.");
        }

        var existingPending = await _requestRepository.FirstOrDefaultAsync(x =>
            x.StudentUserId == studentId &&
            x.TutorUserId == input.TutorUserId &&
            x.SubjectId == input.SubjectId &&
            x.Status == TutorRequestStatus.Pending);

        if (existingPending != null)
        {
            throw new UserFriendlyException("A tutor request is already pending.");
        }

        var request = new StudentTutorRequest(Guid.NewGuid(), studentId, assignment.TutorUserId, assignment.SubjectId, input.Message);
        await _requestRepository.InsertAsync(request);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await MapTutorRequestAsync(request, studentId);
    }

    public async Task<List<TutorRequestDto>> GetMyTutorRequestsAsync()
    {
        var studentId = await EnsureStudentAsync();
        var requests = await _requestRepository.GetAll()
            .AsNoTracking()
            .Where(x => x.StudentUserId == studentId)
            .OrderByDescending(x => x.CreationTime)
            .ToListAsync();
        return await MapTutorRequestsAsync(requests, studentId);
    }

    public async Task<List<LinkedTutorDto>> GetMyTutorsAsync()
    {
        var studentId = await EnsureStudentAsync();
        var links = await _linkRepository.GetAll()
            .AsNoTracking()
            .Where(x => x.StudentUserId == studentId && x.IsActive)
            .OrderByDescending(x => x.LinkedAtUtc)
            .ToListAsync();

        if (links.Count == 0)
        {
            return [];
        }

        var tutorIds = links.Select(x => x.TutorUserId).Distinct().ToList();
        var subjectIds = links.Select(x => x.SubjectId).Distinct().ToList();
        var tutors = await _userRepository.GetAll().AsNoTracking().Where(x => tutorIds.Contains(x.Id)).ToListAsync();
        var assignments = await _assignmentRepository.GetAll().AsNoTracking().Where(x => tutorIds.Contains(x.TutorUserId)).ToListAsync();
        var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(studentId);
        var subjectNameMap = await BuildSubjectNameMapAsync(subjectIds, languageCode);
        var tutorNameById = tutors.ToDictionary(x => x.Id, BuildDisplayName);
        var assignmentByTutorAndSubject = assignments.ToDictionary(x => $"{x.TutorUserId}:{x.SubjectId}");

        return links.Select(link =>
        {
            assignmentByTutorAndSubject.TryGetValue($"{link.TutorUserId}:{link.SubjectId}", out var assignment);

            return new LinkedTutorDto
            {
                LinkId = link.Id,
                TutorUserId = link.TutorUserId,
                TutorName = tutorNameById.GetValueOrDefault(link.TutorUserId, "Tutor"),
                SubjectId = link.SubjectId,
                SubjectName = subjectNameMap.GetValueOrDefault(link.SubjectId, "Subject"),
                Bio = assignment?.Bio,
                Specialization = assignment?.Specialization,
                LinkedAtUtc = link.LinkedAtUtc,
            };
        }).ToList();
    }

    public async Task<MeetingRequestDto> RequestMeetingAsync(RequestMeetingInput input)
    {
        var studentId = await EnsureStudentAsync();
        var link = await _linkRepository.FirstOrDefaultAsync(x => x.Id == input.LinkId && x.StudentUserId == studentId && x.IsActive)
            ?? throw new UserFriendlyException("Tutor link not found.");

        if (input.ScheduledStartUtc <= DateTime.UtcNow)
        {
            throw new UserFriendlyException("Meeting start time must be in the future.");
        }

        var meetingRequest = new TutorMeetingRequest(
            Guid.NewGuid(),
            link.Id,
            studentId,
            link.TutorUserId,
            link.SubjectId,
            input.ScheduledStartUtc,
            input.DurationMinutes,
            input.Message);

        await _meetingRequestRepository.InsertAsync(meetingRequest);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await MapMeetingRequestAsync(meetingRequest, studentId);
    }

    public async Task<List<MeetingRequestDto>> GetMyMeetingRequestsAsync()
    {
        var studentId = await EnsureStudentAsync();
        var requests = await _meetingRequestRepository.GetAll()
            .AsNoTracking()
            .Where(x => x.StudentUserId == studentId)
            .OrderByDescending(x => x.ScheduledStartUtc)
            .ToListAsync();
        return await MapMeetingRequestsAsync(requests, studentId);
    }

    public async Task<MeetingAccessDto> GetMeetingAccessAsync(Guid meetingRequestId)
    {
        var studentId = await EnsureStudentAsync();
        var request = await _meetingRequestRepository.FirstOrDefaultAsync(x => x.Id == meetingRequestId && x.StudentUserId == studentId)
            ?? throw new UserFriendlyException("Meeting request not found.");

        if (request.Status != MeetingRequestStatus.Accepted && request.Status != MeetingRequestStatus.Completed)
        {
            throw new UserFriendlyException("Meeting is not available yet.");
        }

        var session = await _meetingSessionRepository.FirstOrDefaultAsync(x => x.MeetingRequestId == request.Id)
            ?? throw new UserFriendlyException("Meeting session is not available yet.");

        var tutor = await _userRepository.GetAsync(request.TutorUserId);
        var subjectNameMap = await BuildSubjectNameMapAsync([request.SubjectId], await _languageResolver.GetUserPreferredLanguageCodeAsync(studentId));

        return new MeetingAccessDto
        {
            MeetingRequestId = request.Id,
            MeetingSessionId = session.Id,
            SubjectName = subjectNameMap.GetValueOrDefault(request.SubjectId, "Subject"),
            OtherParticipantName = BuildDisplayName(tutor),
            IsTutor = false,
            CanJoin = request.Status == MeetingRequestStatus.Accepted,
        };
    }

    private async Task<long> EnsureStudentAsync()
    {
        var user = await GetCurrentUserAsync();
        var roles = await UserManager.GetRolesAsync(user);
        if (!roles.Any(role => string.Equals(role, UserRoleNames.Student, StringComparison.OrdinalIgnoreCase)))
        {
            throw new AbpAuthorizationException("Only students can access this resource.");
        }

        return user.Id;
    }

    private async Task EnsureStudentEnrolledAsync(long studentId, Guid subjectId)
    {
        var isEnrolled = await _enrollmentRepository.GetAll()
            .AnyAsync(x => x.StudentId == studentId && x.SubjectId == subjectId && x.IsActive);

        if (!isEnrolled)
        {
            throw new UserFriendlyException("You are not enrolled in this subject.");
        }
    }

    private async Task<TutorRequestDto> MapTutorRequestAsync(StudentTutorRequest request, long viewerUserId)
    {
        return (await MapTutorRequestsAsync([request], viewerUserId)).Single();
    }

    private async Task<MeetingRequestDto> MapMeetingRequestAsync(TutorMeetingRequest request, long viewerUserId)
    {
        return (await MapMeetingRequestsAsync([request], viewerUserId)).Single();
    }

    private async Task<List<TutorRequestDto>> MapTutorRequestsAsync(IReadOnlyCollection<StudentTutorRequest> requests, long viewerUserId)
    {
        if (requests.Count == 0)
        {
            return [];
        }

        var userIds = requests.SelectMany(x => new[] { x.StudentUserId, x.TutorUserId }).Distinct().ToList();
        var users = await _userRepository.GetAll()
            .AsNoTracking()
            .Where(x => userIds.Contains(x.Id))
            .ToListAsync();
        var userNameById = users.ToDictionary(x => x.Id, BuildDisplayName);
        var subjectNameMap = await BuildSubjectNameMapAsync(
            requests.Select(x => x.SubjectId),
            await _languageResolver.GetUserPreferredLanguageCodeAsync(viewerUserId));

        return requests.Select(request => new TutorRequestDto
        {
            RequestId = request.Id,
            StudentUserId = request.StudentUserId,
            TutorUserId = request.TutorUserId,
            StudentName = userNameById.GetValueOrDefault(request.StudentUserId, "Student"),
            TutorName = userNameById.GetValueOrDefault(request.TutorUserId, "Tutor"),
            SubjectId = request.SubjectId,
            SubjectName = subjectNameMap.GetValueOrDefault(request.SubjectId, "Subject"),
            Status = request.Status.ToString(),
            Message = request.StudentMessage,
            ResponseMessage = request.ResponseMessage,
            CreatedAt = request.CreationTime,
            RespondedAtUtc = request.RespondedAtUtc,
        }).ToList();
    }

    private async Task<List<MeetingRequestDto>> MapMeetingRequestsAsync(IReadOnlyCollection<TutorMeetingRequest> requests, long viewerUserId)
    {
        if (requests.Count == 0)
        {
            return [];
        }

        var userIds = requests.SelectMany(x => new[] { x.StudentUserId, x.TutorUserId }).Distinct().ToList();
        var meetingRequestIds = requests.Select(x => x.Id).ToList();
        var users = await _userRepository.GetAll()
            .AsNoTracking()
            .Where(x => userIds.Contains(x.Id))
            .ToListAsync();
        var sessions = await _meetingSessionRepository.GetAll()
            .AsNoTracking()
            .Where(x => meetingRequestIds.Contains(x.MeetingRequestId))
            .ToListAsync();
        var sessionIdByMeetingRequestId = sessions.ToDictionary(x => x.MeetingRequestId, x => x.Id);
        var userNameById = users.ToDictionary(x => x.Id, BuildDisplayName);
        var subjectNameMap = await BuildSubjectNameMapAsync(
            requests.Select(x => x.SubjectId),
            await _languageResolver.GetUserPreferredLanguageCodeAsync(viewerUserId));

        return requests.Select(request =>
        {
            var hasSession = sessionIdByMeetingRequestId.TryGetValue(request.Id, out var sessionId);

            return new MeetingRequestDto
            {
                MeetingRequestId = request.Id,
                LinkId = request.StudentTutorLinkId,
                StudentUserId = request.StudentUserId,
                TutorUserId = request.TutorUserId,
                StudentName = userNameById.GetValueOrDefault(request.StudentUserId, "Student"),
                TutorName = userNameById.GetValueOrDefault(request.TutorUserId, "Tutor"),
                SubjectId = request.SubjectId,
                SubjectName = subjectNameMap.GetValueOrDefault(request.SubjectId, "Subject"),
                ScheduledStartUtc = request.ScheduledStartUtc,
                DurationMinutes = request.DurationMinutes,
                Status = request.Status.ToString(),
                StudentMessage = request.StudentMessage,
                TutorResponseMessage = request.TutorResponseMessage,
                MeetingSessionId = hasSession ? sessionId : null,
                CanJoin = request.Status == MeetingRequestStatus.Accepted && hasSession,
            };
        }).ToList();
    }

    private async Task<Dictionary<Guid, string>> BuildSubjectNameMapAsync(IEnumerable<Guid> subjectIds, string languageCode)
    {
        var ids = subjectIds.Distinct().ToList();
        var subjects = await _subjectRepository.GetAll()
            .AsNoTracking()
            .Where(x => ids.Contains(x.Id))
            .ToListAsync();
        var translations = await _subjectTranslationRepository.GetAll()
            .AsNoTracking()
            .Where(x => ids.Contains(x.SubjectId))
            .ToListAsync();
        var languages = await _languageRepository.GetAll()
            .AsNoTracking()
            .ToListAsync();

        var languageCodeToId = languages.ToDictionary(x => x.Code.ToLowerInvariant(), x => x.Id);
        var translationsBySubjectId = translations
            .GroupBy(x => x.SubjectId)
            .ToDictionary(group => group.Key, group => group.ToList());

        var result = new Dictionary<Guid, string>();
        foreach (var subject in subjects)
        {
            result[subject.Id] = ResolveSubjectName(
                subject,
                translationsBySubjectId.GetValueOrDefault(subject.Id) ?? [],
                languageCodeToId,
                languageCode);
        }

        return result;
    }

    private static string ResolveSubjectName(
        Subject subject,
        IReadOnlyCollection<SubjectTranslation> translations,
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
