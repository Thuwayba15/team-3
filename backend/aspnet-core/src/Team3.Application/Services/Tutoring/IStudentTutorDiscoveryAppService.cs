using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Services.Tutoring.Dto;

namespace Team3.Services.Tutoring;

public interface IStudentTutorDiscoveryAppService : IApplicationService
{
    Task<List<TutorListItemDto>> GetAvailableTutorsAsync();
}
