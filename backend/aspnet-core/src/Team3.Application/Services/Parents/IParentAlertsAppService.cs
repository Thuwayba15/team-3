using System.Threading.Tasks;
using Abp.Application.Services;
using Abp.Application.Services.Dto;
using Team3.Services.Parents.Dto;

namespace Team3.Services.Parents;

public interface IParentAlertsAppService : IApplicationService
{
    /// <summary>Returns alerts for the parent's linked student, optionally filtered by category.</summary>
    Task<ListResultDto<AlertDto>> GetAlertsAsync(string? category = null);

    /// <summary>Marks a specific alert as dismissed.</summary>
    Task DismissAlertAsync(long alertId);
}
