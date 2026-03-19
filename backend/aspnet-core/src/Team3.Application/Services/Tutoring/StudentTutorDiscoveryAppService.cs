using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using Team3.Authorization.Users;
using Team3.Domain.Tutoring;
using Team3.Services.Tutoring.Dto;
using Team3.Users;

namespace Team3.Services.Tutoring;

[AbpAuthorize]
public class StudentTutorDiscoveryAppService : Team3AppServiceBase, IStudentTutorDiscoveryAppService
{
    private readonly IRepository<TutorProfile, long> _tutorProfileRepo;
    private readonly IRepository<User, long> _userRepo;
    private readonly IRepository<StudentTutorLink, long> _linkRepo;
    private readonly IRepository<StudentTutorRequest, long> _requestRepo;

    public StudentTutorDiscoveryAppService(
        IRepository<TutorProfile, long> tutorProfileRepo,
        IRepository<User, long> userRepo,
        IRepository<StudentTutorLink, long> linkRepo,
        IRepository<StudentTutorRequest, long> requestRepo)
    {
        _tutorProfileRepo = tutorProfileRepo;
        _userRepo = userRepo;
        _linkRepo = linkRepo;
        _requestRepo = requestRepo;
    }

    public async Task<List<TutorListItemDto>> GetAvailableTutorsAsync()
    {
        var studentUser = await EnsureCurrentUserInRoleAsync(UserRoleNames.Student);

        var linkedTutorIds = await _linkRepo.GetAll()
            .Where(x => x.StudentUserId == studentUser.Id)
            .Select(x => x.TutorUserId)
            .ToListAsync();

        var pendingTutorIds = await _requestRepo.GetAll()
            .Where(x => x.StudentUserId == studentUser.Id && x.Status == StudentTutorRequestStatus.Pending)
            .Select(x => x.TutorUserId)
            .ToListAsync();

        var profiles = await _tutorProfileRepo.GetAll()
            .Where(x => !linkedTutorIds.Contains(x.UserId))
            .ToListAsync();

        var userIds = profiles.Select(x => x.UserId).ToList();
        var users = userIds.Count == 0
            ? []
            : await _userRepo.GetAll().Where(x => userIds.Contains(x.Id)).ToListAsync();

        return profiles
            .Select(profile =>
            {
                var user = users.FirstOrDefault(x => x.Id == profile.UserId);
                if (user == null)
                {
                    return null;
                }

                return new TutorListItemDto
                {
                    TutorUserId = profile.UserId,
                    FullName = $"{user.Name} {user.Surname}",
                    Initials = BuildInitials(user.Name, user.Surname),
                    Specialization = profile.Specialization,
                    Bio = profile.Bio,
                    SubjectInterests = profile.SubjectInterests,
                    HasPendingRequest = pendingTutorIds.Contains(profile.UserId)
                };
            })
            .Where(x => x != null)
            .OrderBy(x => x!.FullName)
            .Select(x => x!)
            .ToList();
    }

    private static string BuildInitials(string name, string surname)
    {
        var n = name.Length > 0 ? name[0].ToString().ToUpper() : "";
        var s = surname.Length > 0 ? surname[0].ToString().ToUpper() : "";
        return n + s;
    }
}
