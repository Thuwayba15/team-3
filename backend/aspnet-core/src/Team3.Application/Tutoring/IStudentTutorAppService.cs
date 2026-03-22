using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Tutoring.Dto;

namespace Team3.Tutoring;

public interface IStudentTutorAppService : IApplicationService
{
    Task<List<AvailableTutorDto>> GetAvailableTutorsAsync(Guid? subjectId = null);
    Task<TutorRequestDto> RequestTutorAsync(RequestTutorInput input);
    Task<List<TutorRequestDto>> GetMyTutorRequestsAsync();
    Task<List<LinkedTutorDto>> GetMyTutorsAsync();
    Task<MeetingRequestDto> RequestMeetingAsync(RequestMeetingInput input);
    Task<List<MeetingRequestDto>> GetMyMeetingRequestsAsync();
    Task<MeetingAccessDto> GetMeetingAccessAsync(Guid meetingRequestId);
}
