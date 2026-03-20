using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Configuration;
using Team3.Languages.Dto;

namespace Team3.Languages;

[AbpAllowAnonymous]
public class LanguageAppService : Team3AppServiceBase, ILanguageAppService
{
    public IRepository<Language, Guid> LanguageRepository { get; set; }

    /// <summary>Returns all platform languages ordered by sort order.</summary>
    public async Task<List<LanguageResponse>> GetAllAsync()
    {
        var languages = await LanguageRepository.GetAllListAsync();
        return languages
            .OrderBy(l => l.SortOrder)
            .ThenBy(l => l.Name)
            .Select(MapToResponse)
            .ToList();
    }

    /// <summary>Creates a new platform language.</summary>
    public async Task<LanguageResponse> CreateAsync(CreateLanguageRequest input)
    {
        var existing = await LanguageRepository.FirstOrDefaultAsync(l => l.Code == input.Code.Trim().ToLowerInvariant());
        if (existing != null)
            throw new UserFriendlyException($"A language with code '{input.Code}' already exists.");

        var language = new Language(
            Guid.NewGuid(),
            input.Code,
            input.Name,
            input.NativeName,
            input.IsDefault,
            input.IsActive,
            input.SortOrder);

        await LanguageRepository.InsertAsync(language);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapToResponse(language);
    }

    /// <summary>Updates an existing platform language.</summary>
    public async Task<LanguageResponse> UpdateAsync(Guid id, UpdateLanguageRequest input)
    {
        var language = await LanguageRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Language not found.");

        language.Update(input.Name, input.NativeName, input.IsActive, input.SortOrder);
        language.SetDefault(input.IsDefault);

        await LanguageRepository.UpdateAsync(language);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapToResponse(language);
    }

    /// <summary>Deletes a platform language by ID.</summary>
    public async Task DeleteAsync(Guid id)
    {
        var language = await LanguageRepository.FirstOrDefaultAsync(id)
            ?? throw new UserFriendlyException("Language not found.");

        await LanguageRepository.DeleteAsync(language);
    }

    private static LanguageResponse MapToResponse(Language l) => new()
    {
        Id = l.Id,
        Code = l.Code,
        Name = l.Name,
        NativeName = l.NativeName,
        IsActive = l.IsActive,
        IsDefault = l.IsDefault,
        SortOrder = l.SortOrder,
    };
}
