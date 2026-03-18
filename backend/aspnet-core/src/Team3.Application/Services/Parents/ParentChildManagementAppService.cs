using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Team3.Authorization.Users;
using Team3.Domain.Parents;
using Team3.Services.Parents.Dto;
using Team3.Users;

namespace Team3.Services.Parents;

public class ParentChildManagementAppService : Team3AppServiceBase, IParentChildManagementAppService
{
    private readonly IRepository<ParentStudentLink, long> _linkRepo;
    private readonly IRepository<StudentProfile,    long> _studentProfileRepo;
    private readonly UserRegistrationManager              _userRegistrationManager;

    public ParentChildManagementAppService(
        IRepository<ParentStudentLink, long> linkRepo,
        IRepository<StudentProfile,    long> studentProfileRepo,
        UserRegistrationManager              userRegistrationManager)
    {
        _linkRepo                = linkRepo;
        _studentProfileRepo      = studentProfileRepo;
        _userRegistrationManager = userRegistrationManager;
    }

    public async Task<List<ChildLinkResultDto>> GetMyChildrenAsync()
    {
        var parentUserId = AbpSession.GetUserId();

        var links = await _linkRepo.GetAll()
            .Where(l => l.ParentUserId == parentUserId)
            .ToListAsync();

        var result = new List<ChildLinkResultDto>();

        foreach (var link in links)
        {
            var studentUser = await UserManager.FindByIdAsync(link.StudentUserId.ToString());
            if (studentUser == null) continue;

            var profile = await _studentProfileRepo.FirstOrDefaultAsync(p => p.UserId == link.StudentUserId);

            result.Add(new ChildLinkResultDto
            {
                StudentUserId = link.StudentUserId,
                StudentName   = $"{studentUser.Name} {studentUser.Surname}",
                GradeLevel    = profile?.GradeLevel ?? "Unknown",
                Relationship  = link.RelationshipType,
                Initials      = BuildInitials(studentUser.Name, studentUser.Surname),
            });
        }

        return result;
    }

    public async Task<ChildLinkResultDto> LinkChildAsync(LinkChildInput input)
    {
        var parentUserId = AbpSession.GetUserId();

        var studentUser = await UserManager.FindByNameAsync(input.UsernameOrEmail)
                       ?? await UserManager.FindByEmailAsync(input.UsernameOrEmail)
                       ?? throw new UserFriendlyException($"No student account found for '{input.UsernameOrEmail}'.");

        if (!await UserManager.IsInRoleAsync(studentUser, "Student"))
            throw new UserFriendlyException("The specified account does not belong to a student.");

        var existing = await _linkRepo.FirstOrDefaultAsync(
            l => l.ParentUserId == parentUserId && l.StudentUserId == studentUser.Id);

        if (existing != null)
            throw new UserFriendlyException("You are already linked to this student.");

        var link = new ParentStudentLink(parentUserId, studentUser.Id, "Parent");
        await _linkRepo.InsertAsync(link);

        var profile = await _studentProfileRepo.FirstOrDefaultAsync(p => p.UserId == studentUser.Id);

        return new ChildLinkResultDto
        {
            StudentUserId = studentUser.Id,
            StudentName   = $"{studentUser.Name} {studentUser.Surname}",
            GradeLevel    = profile?.GradeLevel ?? "Unknown",
            Relationship  = "Parent",
            Initials      = BuildInitials(studentUser.Name, studentUser.Surname),
        };
    }

    public async Task<ChildLinkResultDto> RegisterChildAsync(RegisterChildInput input)
    {
        var parentUserId = AbpSession.GetUserId();

        var studentUser = await _userRegistrationManager.RegisterAsync(
            input.Name,
            input.Surname,
            input.EmailAddress,
            input.UserName,
            input.Password,
            isEmailConfirmed: true);

        CheckErrors(await UserManager.SetRolesAsync(studentUser, ["Student"]));

        var profile = new StudentProfile(
            userId:            studentUser.Id,
            preferredLanguage: "en",
            gradeLevel:        "Unknown",
            progressLevel:     null,
            subjectInterests:  null);

        await _studentProfileRepo.InsertAsync(profile);

        var link = new ParentStudentLink(parentUserId, studentUser.Id, "Parent");
        await _linkRepo.InsertAsync(link);

        return new ChildLinkResultDto
        {
            StudentUserId = studentUser.Id,
            StudentName   = $"{studentUser.Name} {studentUser.Surname}",
            GradeLevel    = "Unknown",
            Relationship  = "Parent",
            Initials      = BuildInitials(studentUser.Name, studentUser.Surname),
        };
    }

    private static string BuildInitials(string name, string surname)
    {
        var n = name.Length    > 0 ? name[0].ToString().ToUpper()    : "";
        var s = surname.Length > 0 ? surname[0].ToString().ToUpper() : "";
        return n + s;
    }
}
