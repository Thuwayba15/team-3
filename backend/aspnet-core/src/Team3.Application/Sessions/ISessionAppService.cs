using Abp.Application.Services;
using Team3.Sessions.Dto;
using System.Threading.Tasks;

namespace Team3.Sessions;

public interface ISessionAppService : IApplicationService
{
    Task<GetCurrentLoginInformationsOutput> GetCurrentLoginInformations();
}
