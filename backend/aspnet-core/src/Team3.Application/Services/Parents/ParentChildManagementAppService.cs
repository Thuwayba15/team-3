using System;
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

    public async Task<ChildLinkResultDto> LinkChildAsync(LinkChildInput input)
    {
        var parentUserId = AbpSession.GetUserId();

        // Find the student by username or email
        var studentUser = await UserManager.FindByNameAsync(input.UsernameOrEmail)
                       ?? await UserManager.FindByEmailAsync(input.UsernameOrEmail)
                       ?? throw new UserFriendlyException($"No student account found for '{input.UsernameOrEmail}'.");

        // Must be in Student role
        if (!await UserManager.IsInRoleAsync(studentUser, "Student"))
            throw new UserFriendlyException("The specified account does not belong to a student.");

        // Check for duplicate link
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
        };
    }

    public async Task<ChildLinkResultDto> RegisterChildAsync(RegisterChildInput input)
    {
        var parentUserId = AbpSession.GetUserId();

        // Register the new user via ABP's registration manager
        var studentUser = await _userRegistrationManager.RegisterAsync(
            input.Name,
            input.Surname,
            input.EmailAddress,
            input.UserName,
            input.Password,
            isEmailConfirmed: true);

        // Assign Student role
        CheckErrors(await UserManager.SetRolesAsync(studentUser, ["Student"]));

        // Create the student profile
        var profile = new StudentProfile(
            userId:            studentUser.Id,
            preferredLanguage: "en",
            gradeLevel:        input.GradeLevel,
            progressLevel:     null,
            subjectInterests:  null);

        await _studentProfileRepo.InsertAsync(profile);

        // Link the new student to the parent
        var link = new ParentStudentLink(parentUserId, studentUser.Id, "Parent");
        await _linkRepo.InsertAsync(link);

        return new ChildLinkResultDto
        {
            StudentUserId = studentUser.Id,
            StudentName   = $"{studentUser.Name} {studentUser.Surname}",
            GradeLevel    = input.GradeLevel,
            Relationship  = "Parent",
        };
    }
}
