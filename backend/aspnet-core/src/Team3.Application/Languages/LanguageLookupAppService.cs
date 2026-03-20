using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;
using Team3.Configuration;
using Team3.Users.Dto;

namespace Team3.Languages;

[AbpAuthorize]
public class LanguageLookupAppService : Team3AppServiceBase, ILanguageLookupAppService
{
    private readonly IRepository<Language, Guid> _languageRepository;

    public LanguageLookupAppService(IRepository<Language, Guid> languageRepository)
    {
        _languageRepository = languageRepository;
    }

    public async Task<ListResultDto<PlatformLanguageOptionDto>> GetSupportedLanguagesAsync()
    {
        var languages = await _languageRepository.GetAllListAsync();

        var items = languages
            .Where(language => !language.IsDeleted)
            .OrderBy(language => language.SortOrder)
            .ThenBy(language => language.Name)
            .Select(language => new PlatformLanguageOptionDto
            {
                Code = language.Code,
                Name = string.IsNullOrWhiteSpace(language.NativeName) ? language.Name : language.NativeName,
                IsDefault = language.IsDefault,
            })
            .ToList();

        return new ListResultDto<PlatformLanguageOptionDto>(items);
    }
}
