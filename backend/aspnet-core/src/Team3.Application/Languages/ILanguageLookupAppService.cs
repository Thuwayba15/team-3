using Abp.Application.Services;
using Abp.Application.Services.Dto;
using System.Threading.Tasks;
using Team3.Users.Dto;

namespace Team3.Languages;

public interface ILanguageLookupAppService : IApplicationService
{
    Task<ListResultDto<PlatformLanguageOptionDto>> GetSupportedLanguagesAsync();
}
