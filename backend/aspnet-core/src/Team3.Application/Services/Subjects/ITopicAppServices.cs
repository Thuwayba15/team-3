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
    public interface ITopicAppService : IApplicationService
    {
        // Get all chapters for a specific subject (e.g., all topics for Life Sciences)
        Task<ListResultDto<TopicDto>> GetTopicsBySubjectAsync(Guid subjectId);
    }
}
