using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Services.Parents.Dto;

namespace Team3.Services.Parents;

public interface IParentChildManagementAppService : IApplicationService
{
    /// <summary>Links the current parent to an existing student account by username or email.</summary>
    Task<ChildLinkResultDto> LinkChildAsync(LinkChildInput input);

    /// <summary>Creates a new student account and links it to the current parent.</summary>
    Task<ChildLinkResultDto> RegisterChildAsync(RegisterChildInput input);
}
