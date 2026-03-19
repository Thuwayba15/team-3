using System;
using System.Threading.Tasks;
using Team3.Students.Dto;

namespace Team3.Students
{
    public interface IStudentAssessmentAppService
    {
        Task<StudentAssessmentDto> GetAssessmentAsync(Guid assessmentId);
        Task<SubmitStudentAssessmentOutputDto> SubmitDiagnosticAsync(SubmitStudentAssessmentInputDto input);
        Task<SubmitStudentAssessmentOutputDto> SubmitLessonQuizAsync(SubmitStudentAssessmentInputDto input);
    }
}
