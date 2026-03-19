using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Services.Assessments
{
    public interface IAssessmentGenerationAppService
    {
        Task<GeneratedAssessmentOutput> GenerateLessonQuizAsync(GenerateLessonQuizInput input);
        Task<GeneratedAssessmentOutput> GenerateDiagnosticQuizAsync(GenerateDiagnosticQuizInput input);
        Task<GeneratedAssessmentOutput> GetLessonAssessmentsAsync(Guid lessonId);
        Task<GeneratedAssessmentOutput> GetDiagnosticAssessmentsAsync(Guid subjectId);
    }
}
