using Abp.Application.Services.Dto;
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
    public class LessonAppService : Team3AppServiceBase, ILessonAppService
    {
        private readonly IRepository<Lesson, Guid> _lessonRepository;

        public LessonAppService(IRepository<Lesson, Guid> lessonRepository)
        {
            _lessonRepository = lessonRepository;
        }

        public async Task<ListResultDto<LessonDto>> GetLessonsByTopicAsync(Guid topicId)
        {
            var lessons = await _lessonRepository.GetAll()
                .Include(l => l.Translations)
                .Include(l => l.Materials) // Load the YouTube links/PDFs
                .Where(l => l.TopicId == topicId)
                .OrderBy(l => l.SortOrder)
                .ToListAsync();

            return new ListResultDto<LessonDto>(
                ObjectMapper.Map<List<LessonDto>>(lessons)
            );
        }

        public async Task<LessonDto> GetAsync(Guid id)
        {
            var lesson = await _lessonRepository.GetAll()
                .Include(l => l.Translations)
                .Include(l => l.Materials)
                .FirstOrDefaultAsync(l => l.Id == id);

            return ObjectMapper.Map<LessonDto>(lesson);
        }
    }
}
