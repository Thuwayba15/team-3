using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Application.Services;
using Team3.Services.Tutoring.Dto;

namespace Team3.Services.Tutoring;

public interface IStudentTutorRelationshipAppService : IApplicationService
{
    Task<TutorRequestDto> RequestTutorAsync(RequestTutorInput input);
    Task<List<TutorRequestDto>> GetMyTutorRequestsAsync();
    Task<List<StudentTutorLinkDto>> GetMyTutorsAsync();
    Task<List<TutorRequestDto>> GetPendingRequestsAsync();
    Task<TutorRequestDto> RespondToTutorRequestAsync(RespondToTutorRequestInput input);
    Task<List<TutorStudentLinkDto>> GetMyStudentsAsync();
}
