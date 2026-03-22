using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Users.Dto;

namespace Team3.Users;

public interface IAdminDashboardAppService : IApplicationService
{
    Task<AdminDashboardSummaryDto> GetSummaryAsync();
}
