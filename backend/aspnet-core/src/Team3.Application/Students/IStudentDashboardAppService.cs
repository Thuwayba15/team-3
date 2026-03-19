using System;
using System.Threading.Tasks;
using Team3.Students.Dto;

namespace Team3.Students
{
    public interface IStudentDashboardAppService
    {
        Task<StudentDashboardProgressDto> GetProgressAsync(Guid? subjectId);
    }
}
