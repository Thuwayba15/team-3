using Abp.Application.Services;
using Team3.Authorization.Accounts.Dto;
using System.Threading.Tasks;

namespace Team3.Authorization.Accounts;

public interface IAccountAppService : IApplicationService
{
    Task<IsTenantAvailableOutput> IsTenantAvailable(IsTenantAvailableInput input);

    Task<RegisterOutput> Register(RegisterInput input);
}
