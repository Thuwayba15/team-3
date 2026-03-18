using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Services.Parents.Dto;

namespace Team3.Services.Parents;

public interface IParentChildProgressAppService : IApplicationService
{
    Task<ChildProgressDto> GetChildProgressAsync(long? studentUserId = null);
}
