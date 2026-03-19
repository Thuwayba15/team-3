using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials.Subjects
{
    public interface IStudentSubjectAppService
    {
        Task<List<SubjectDto>> GetAllSubjectsAsync();
        Task<List<SubjectDto>> GetMySubjectsAsync();
        Task<BulkEnrollOutput> BulkEnrollAsync(BulkEnrollInput input);
        Task<StudentProgressDto> GetSubjectProgressAsync(Guid subjectId);
        Task<List<TopicDto>> GetTopicsBySubjectAsync(Guid subjectId);
        Task<List<LessonSummaryDto>> GetLessonsByTopicAsync(Guid topicId);
        Task<LessonDetailDto> GetLessonAsync(Guid lessonId);
    }
}
