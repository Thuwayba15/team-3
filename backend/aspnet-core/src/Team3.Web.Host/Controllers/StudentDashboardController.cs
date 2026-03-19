using Abp.Authorization;
using Team3.Students;
using Team3.Students.Dto;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Team3.Controllers
{
    [Route("api/services/app/student-dashboard")]
    public class StudentDashboardController : Team3ControllerBase
    {
        private readonly IStudentDashboardAppService _studentDashboardAppService;

        public StudentDashboardController(IStudentDashboardAppService studentDashboardAppService)
        {
            _studentDashboardAppService = studentDashboardAppService;
        }

        /// <summary>
        /// Get current user's complete dashboard with progress metrics, weak topics, and recommendations.
        /// </summary>
        /// <param name="subjectId">Optional subject filter. If null, aggregates across all enrolled subjects.</param>
        /// <returns>Dashboard data including mastery scores, weak topics, recommendations, and motivational guidance.</returns>
        [HttpGet("get-my-dashboard")]
        [AbpAuthorize]
        public async Task<StudentDashboardProgressDto> GetMyDashboard(Guid? subjectId = null)
        {
            return await _studentDashboardAppService.GetProgressAsync(subjectId);
        }
    }
}
