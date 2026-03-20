using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Tutoring.Dto;

namespace Team3.Tutoring;

public interface ITutorPortalAppService : IApplicationService
{
    Task<TutorSetupStatusDto> GetSetupStatusAsync();
    Task<List<TutorSubjectOptionDto>> GetAvailableSubjectsAsync();
    Task<TutorSetupStatusDto> CompleteSetupAsync(CompleteTutorSetupInput input);
    Task<TutorDashboardDto> GetDashboardAsync();
    Task<List<TutorRequestDto>> GetStudentRequestsAsync();
    Task<TutorRequestDto> RespondToStudentRequestAsync(RespondToTutorRequestInput input);
    Task<List<MeetingRequestDto>> GetMeetingsAsync();
    Task<MeetingRequestDto> RespondToMeetingRequestAsync(RespondToMeetingRequestInput input);
    Task<MeetingAccessDto> StartMeetingAsync(Guid meetingRequestId);
    Task<MeetingAccessDto> GetMeetingAccessAsync(Guid meetingRequestId);
}
