using System;
using System.Threading.Tasks;
using Team3.Students.Dto;

namespace Team3.Students
{
    public interface IStudentLearningPathAppService
    {
        Task<StudentLearningPathDto> GetSubjectPathAsync(Guid subjectId);
        Task<CompleteLessonOutputDto> CompleteLessonAsync(CompleteLessonInputDto input);
    }
}
