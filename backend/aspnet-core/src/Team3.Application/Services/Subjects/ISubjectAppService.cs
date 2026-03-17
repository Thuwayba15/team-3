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
    public interface ISubjectAppService : IApplicationService
    {
        // Get all subjects (automatically localized)
        Task<ListResultDto<SubjectDto>> GetAllAsync();

        // Link a subject to the logged-in student
        Task EnrollInSubjectAsync(Guid subjectId);

        // Get subjects the current student is enrolled in
        Task<ListResultDto<SubjectDto>> GetMySubjectsAsync();

        // Bulk enroll in multiple subjects
        Task BulkEnrollAsync(List<Guid> subjectIds);

        // Get progress for a specific subject
        Task<double> GetSubjectProgressAsync(Guid subjectId);
    }
}
