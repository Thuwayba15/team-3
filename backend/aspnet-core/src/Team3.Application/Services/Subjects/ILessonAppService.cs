using Abp.Application.Services;
using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Services.Subjects.Dto;

namespace Team3.Services.Subjects
{
    public interface ILessonAppService : IApplicationService
    {
        // Get all lessons for a specific chapter (Topic)
        Task<ListResultDto<LessonDto>> GetLessonsByTopicAsync(Guid topicId);

        // Get a specific lesson detail for the AI Tutor to process
        Task<LessonDto> GetAsync(Guid id);
    }
}
