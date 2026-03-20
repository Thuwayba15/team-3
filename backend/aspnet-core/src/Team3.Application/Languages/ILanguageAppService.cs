using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Languages.Dto;

namespace Team3.Languages;

public interface ILanguageAppService : IApplicationService
{
    /// <summary>Returns all platform languages.</summary>
    Task<List<LanguageResponse>> GetAllAsync();

    /// <summary>Creates a new platform language.</summary>
    Task<LanguageResponse> CreateAsync(CreateLanguageRequest input);

    /// <summary>Updates an existing platform language.</summary>
    Task<LanguageResponse> UpdateAsync(Guid id, UpdateLanguageRequest input);

    /// <summary>Deletes a platform language by ID.</summary>
    Task DeleteAsync(Guid id);
}
