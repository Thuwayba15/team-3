using System.Threading.Tasks;
using Team3.LearningMaterials.Dto;
using Abp.Application.Services;

namespace Team3.LearningMaterials
{
    /// <summary>
    /// Service for retrieving personalized student dashboard data.
    /// Combines performance summary, next lesson recommendation, revision advice, and motivational guidance
    /// based on enrollment, progress, and mastery thresholds.
    ///
    /// Business logic:
    /// - Identifies lowest-mastered topics (weak areas) ordered by sequence
    /// - Selects next lesson as the first incomplete topic in weakest-first order
    /// - Generates deterministic revision advice for top 5 weak topics
    /// - Produces motivational guidance based on overall class progress
    /// - Optionally enhances text outputs with AI for personalization (language-aware)
    /// - Gracefully falls back to rule-based text if AI is unavailable
    /// </summary>
    public interface IStudentDashboardAppService : IApplicationService
    {
        /// <summary>
        /// Retrieves the complete dashboard data for the current authenticated student.
        /// 
        /// Steps:
        /// 1. Fetch student enrollment, progress, and profile (language preference)
        /// 2. Compute mastery metrics and identify weak topics
        /// 3. Select next lesson from unmastered topics (weakest first)
        /// 4. Build revision advice for top 5 weak topics
        /// 5. Generate motivational guidance text
        /// 6. Enhance all text fields with AI (optional; language-aware)
        /// 7. Compile heatmap data for visualization
        /// 8. Return aggregated StudentDashboardDto
        ///
        /// Returns: Complete dashboard data or includes null/empty collections (never throws on missing data).
        /// </summary>
        /// <returns>Populated StudentDashboardDto with summary, recommendations, and heatmap.</returns>
        Task<StudentDashboardDto> GetMyDashboardAsync();
    }
}
