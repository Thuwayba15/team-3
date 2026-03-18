using Abp.Application.Services.Dto;
using Abp.Authorization;
using Abp.Domain.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Domain.Subjects;
using Team3.Services.Subjects.Dto;

namespace Team3.Services.Subjects
{
    [AbpAuthorize]
    public class TopicAppService : Team3AppServiceBase, ITopicAppService
    {
        private readonly IRepository<Topic, Guid> _topicRepository;

        public TopicAppService(IRepository<Topic, Guid> topicRepository)
        {
            _topicRepository = topicRepository;
        }

        public async Task<ListResultDto<TopicDto>> GetTopicsBySubjectAsync(Guid subjectId)
        {
            var topics = await _topicRepository.GetAll()
                .Include(t => t.Translations)
                .Where(t => t.SubjectId == subjectId)
                .OrderBy(t => t.SortOrder) // Keep the curriculum order
                .ToListAsync();

            return new ListResultDto<TopicDto>(
                ObjectMapper.Map<List<TopicDto>>(topics)
            );
        }
    }
}

