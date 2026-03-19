using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Team3.Authorization.Users;
using Team3.Domain.Tutoring;
using Team3.Services.Tutoring.Dto;
using Team3.Users;

namespace Team3.Services.Tutoring;

[AbpAuthorize]
public class StudentTutorRelationshipAppService : Team3AppServiceBase, IStudentTutorRelationshipAppService
{
    private readonly IRepository<StudentTutorRequest, long> _requestRepo;
    private readonly IRepository<StudentTutorLink, long> _linkRepo;
    private readonly IRepository<User, long> _userRepo;
    private readonly IRepository<TutorProfile, long> _tutorProfileRepo;
    private readonly IRepository<StudentProfile, long> _studentProfileRepo;

    public StudentTutorRelationshipAppService(
        IRepository<StudentTutorRequest, long> requestRepo,
        IRepository<StudentTutorLink, long> linkRepo,
        IRepository<User, long> userRepo,
        IRepository<TutorProfile, long> tutorProfileRepo,
        IRepository<StudentProfile, long> studentProfileRepo)
    {
        _requestRepo = requestRepo;
        _linkRepo = linkRepo;
        _userRepo = userRepo;
        _tutorProfileRepo = tutorProfileRepo;
        _studentProfileRepo = studentProfileRepo;
    }

    public async Task<TutorRequestDto> RequestTutorAsync(RequestTutorInput input)
    {
        var studentUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Student);
        var tutorUser = await _userRepo.FirstOrDefaultAsync(input.TutorUserId)
            ?? throw new UserFriendlyException("The selected tutor account was not found.");

        if (!await UserManager.IsInRoleAsync(tutorUser, UserRoleNames.Tutor))
        {
            throw new UserFriendlyException("The selected user is not a tutor.");
        }

        var existingLink = await _linkRepo.FirstOrDefaultAsync(
            x => x.StudentUserId == studentUser.Id && x.TutorUserId == tutorUser.Id);
        if (existingLink != null)
        {
            throw new UserFriendlyException("You are already linked to this tutor.");
        }

        var existingPending = await _requestRepo.FirstOrDefaultAsync(
            x => x.StudentUserId == studentUser.Id
              && x.TutorUserId == tutorUser.Id
              && x.Status == StudentTutorRequestStatus.Pending);
        if (existingPending != null)
        {
            throw new UserFriendlyException("You already have a pending request for this tutor.");
        }

        var request = new StudentTutorRequest(studentUser.Id, tutorUser.Id);
        await _requestRepo.InsertAsync(request);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await BuildRequestDtoAsync(request);
    }

    public async Task<List<TutorRequestDto>> GetMyTutorRequestsAsync()
    {
        var studentUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Student);

        var requests = await _requestRepo.GetAll()
            .Where(x => x.StudentUserId == studentUser.Id)
            .OrderByDescending(x => x.RequestedAt)
            .ToListAsync();

        return await BuildRequestDtosAsync(requests);
    }

    public async Task<List<StudentTutorLinkDto>> GetMyTutorsAsync()
    {
        var studentUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Student);

        var links = await _linkRepo.GetAll()
            .Where(x => x.StudentUserId == studentUser.Id)
            .OrderByDescending(x => x.LinkedAt)
            .ToListAsync();

        var tutorIds = links.Select(x => x.TutorUserId).Distinct().ToList();
        var tutors = tutorIds.Count == 0
            ? []
            : await _userRepo.GetAll().Where(x => tutorIds.Contains(x.Id)).ToListAsync();
        var tutorProfiles = tutorIds.Count == 0
            ? []
            : await _tutorProfileRepo.GetAll().Where(x => tutorIds.Contains(x.UserId)).ToListAsync();

        return links
            .Select(link =>
            {
                var tutor = tutors.FirstOrDefault(x => x.Id == link.TutorUserId);
                if (tutor == null)
                {
                    return null;
                }

                var profile = tutorProfiles.FirstOrDefault(x => x.UserId == link.TutorUserId);
                return new StudentTutorLinkDto
                {
                    TutorUserId = link.TutorUserId,
                    TutorName = $"{tutor.Name} {tutor.Surname}",
                    TutorInitials = BuildInitials(tutor.Name, tutor.Surname),
                    TutorSpecialization = profile?.Specialization,
                    TutorBio = profile?.Bio,
                    LinkedAt = link.LinkedAt
                };
            })
            .Where(x => x != null)
            .Select(x => x!)
            .ToList();
    }

    public async Task<List<TutorRequestDto>> GetPendingRequestsAsync()
    {
        var tutorUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Tutor);

        var requests = await _requestRepo.GetAll()
            .Where(x => x.TutorUserId == tutorUser.Id && x.Status == StudentTutorRequestStatus.Pending)
            .OrderByDescending(x => x.RequestedAt)
            .ToListAsync();

        return await BuildRequestDtosAsync(requests);
    }

    public async Task<TutorRequestDto> RespondToTutorRequestAsync(RespondToTutorRequestInput input)
    {
        var tutorUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Tutor);

        var request = await _requestRepo.FirstOrDefaultAsync(input.RequestId)
            ?? throw new UserFriendlyException("Tutor request not found.");

        if (request.TutorUserId != tutorUser.Id)
        {
            throw new UserFriendlyException("You are not allowed to respond to this tutor request.");
        }

        if (request.Status != StudentTutorRequestStatus.Pending)
        {
            throw new UserFriendlyException("This tutor request has already been processed.");
        }

        if (input.Accept)
        {
            var existingLink = await _linkRepo.FirstOrDefaultAsync(
                x => x.StudentUserId == request.StudentUserId && x.TutorUserId == request.TutorUserId);
            if (existingLink != null)
            {
                throw new UserFriendlyException("This student is already linked to you.");
            }

            request.Accept(tutorUser.Id);
            await _linkRepo.InsertAsync(new StudentTutorLink(request.StudentUserId, request.TutorUserId, request.Id));
        }
        else
        {
            request.Decline(tutorUser.Id);
        }

        await _requestRepo.UpdateAsync(request);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await BuildRequestDtoAsync(request);
    }

    public async Task<List<TutorStudentLinkDto>> GetMyStudentsAsync()
    {
        var tutorUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Tutor);

        var links = await _linkRepo.GetAll()
            .Where(x => x.TutorUserId == tutorUser.Id)
            .OrderByDescending(x => x.LinkedAt)
            .ToListAsync();

        var studentIds = links.Select(x => x.StudentUserId).Distinct().ToList();
        var students = studentIds.Count == 0
            ? []
            : await _userRepo.GetAll().Where(x => studentIds.Contains(x.Id)).ToListAsync();
        var studentProfiles = studentIds.Count == 0
            ? []
            : await _studentProfileRepo.GetAll().Where(x => studentIds.Contains(x.UserId)).ToListAsync();

        return links
            .Select(link =>
            {
                var student = students.FirstOrDefault(x => x.Id == link.StudentUserId);
                if (student == null)
                {
                    return null;
                }

                var profile = studentProfiles.FirstOrDefault(x => x.UserId == link.StudentUserId);
                return new TutorStudentLinkDto
                {
                    StudentUserId = link.StudentUserId,
                    StudentName = $"{student.Name} {student.Surname}",
                    StudentInitials = BuildInitials(student.Name, student.Surname),
                    GradeLevel = profile?.GradeLevel,
                    LinkedAt = link.LinkedAt
                };
            })
            .Where(x => x != null)
            .Select(x => x!)
            .ToList();
    }

    private async Task<List<TutorRequestDto>> BuildRequestDtosAsync(List<StudentTutorRequest> requests)
    {
        var result = new List<TutorRequestDto>();
        foreach (var request in requests)
        {
            result.Add(await BuildRequestDtoAsync(request));
        }

        return result;
    }

    private async Task<TutorRequestDto> BuildRequestDtoAsync(StudentTutorRequest request)
    {
        var studentUser = await _userRepo.GetAsync(request.StudentUserId);
        var tutorUser = await _userRepo.GetAsync(request.TutorUserId);
        var studentProfile = await _studentProfileRepo.FirstOrDefaultAsync(x => x.UserId == request.StudentUserId);
        var tutorProfile = await _tutorProfileRepo.FirstOrDefaultAsync(x => x.UserId == request.TutorUserId);

        return new TutorRequestDto
        {
            RequestId = request.Id,
            StudentUserId = request.StudentUserId,
            StudentName = $"{studentUser.Name} {studentUser.Surname}",
            StudentInitials = BuildInitials(studentUser.Name, studentUser.Surname),
            StudentGradeLevel = studentProfile?.GradeLevel,
            TutorUserId = request.TutorUserId,
            TutorName = $"{tutorUser.Name} {tutorUser.Surname}",
            TutorInitials = BuildInitials(tutorUser.Name, tutorUser.Surname),
            TutorSpecialization = tutorProfile?.Specialization,
            Status = request.Status.ToString(),
            RequestedAt = request.RequestedAt,
            RespondedAt = request.RespondedAt
        };
    }

    private static string BuildInitials(string name, string surname)
    {
        var n = name.Length > 0 ? name[0].ToString().ToUpper() : "";
        var s = surname.Length > 0 ? surname[0].ToString().ToUpper() : "";
        return n + s;
    }
}
