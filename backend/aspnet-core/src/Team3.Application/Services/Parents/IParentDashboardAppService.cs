using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Services.Parents.Dto;

namespace Team3.Services.Parents;

public interface IParentDashboardAppService : IApplicationService
{
    Task<ParentDashboardDto> GetDashboardSummaryAsync(long? studentUserId = null);
}
