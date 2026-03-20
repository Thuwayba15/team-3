using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.LearningMaterials.Admin.Dto;

namespace Team3.LearningMaterials.Admin;

[AbpAllowAnonymous]
public class AdminSubjectAppService : Team3AppServiceBase, IAdminSubjectAppService
{
    public IRepository<Subject, Guid> SubjectRepository { get; set; }

    /// <summary>Returns all subjects including inactive ones.</summary>
    public async Task<List<AdminSubjectResponse>> GetAllAsync()
    {
        var subjects = await SubjectRepository.GetAllListAsync();
        return subjects
            .OrderBy(s => s.Name)
            .Select(MapToResponse)
            .ToList();
    }

    /// <summary>Creates a new subject.</summary>
    public async Task<AdminSubjectResponse> CreateAsync(CreateAdminSubjectRequest input)
    {
        var subject = new Subject(
            Guid.NewGuid(),
            input.Name,
            input.GradeLevel,
            input.Description);

        await SubjectRepository.InsertAsync(subject);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapToResponse(subject);
    }

    /// <summary>Updates an existing subject.</summary>
    public async Task<AdminSubjectResponse> UpdateAsync(Guid id, UpdateAdminSubjectRequest input)
    {
        var subject = await SubjectRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Subject not found.");

        subject.UpdateDetails(input.Name, input.GradeLevel, input.Description, input.IsActive);

        await SubjectRepository.UpdateAsync(subject);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapToResponse(subject);
    }

    /// <summary>Deletes (soft-deletes) a subject by ID.</summary>
    public async Task DeleteAsync(Guid id)
    {
        var subject = await SubjectRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Subject not found.");

        await SubjectRepository.DeleteAsync(subject);
    }

    private static AdminSubjectResponse MapToResponse(Subject s) => new()
    {
        Id = s.Id,
        Name = s.Name,
        GradeLevel = s.GradeLevel,
        Description = s.Description,
        IsActive = s.IsActive,
    };
}
