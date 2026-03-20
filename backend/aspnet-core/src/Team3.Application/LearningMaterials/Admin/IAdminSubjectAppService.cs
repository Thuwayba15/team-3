using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.LearningMaterials.Admin.Dto;

namespace Team3.LearningMaterials.Admin;

public interface IAdminSubjectAppService : IApplicationService
{
    /// <summary>Returns all subjects including inactive ones.</summary>
    Task<List<AdminSubjectResponse>> GetAllAsync();

    /// <summary>Creates a new subject.</summary>
    Task<AdminSubjectResponse> CreateAsync(CreateAdminSubjectRequest input);

    /// <summary>Updates an existing subject.</summary>
    Task<AdminSubjectResponse> UpdateAsync(Guid id, UpdateAdminSubjectRequest input);

    /// <summary>Deletes (soft-deletes) a subject by ID.</summary>
    Task DeleteAsync(Guid id);
}
