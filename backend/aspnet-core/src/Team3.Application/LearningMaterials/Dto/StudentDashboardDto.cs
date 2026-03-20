using System;
using System.Collections.Generic;

namespace Team3.LearningMaterials.Dto
{
    /// <summary>
    /// Complete student dashboard data combining progress summary, recommendations, and guidance.
    /// </summary>
    public class StudentDashboardDto
    {
        /// <summary>
        /// Student display name.
        /// </summary>
        public string StudentName { get; set; } = default!;

        /// <summary>
        /// Student grade level (e.g., "Grade 10").
        /// </summary>
        public string GradeLevel { get; set; } = default!;

        /// <summary>
        /// Overall mastery score (0-100) averaged across active subjects.
        /// </summary>
        public decimal OverallScore { get; set; }

        /// <summary>
        /// Number of topics the student has mastered.
        /// </summary>
        public int TopicsMastered { get; set; }

        /// <summary>
        /// Total number of topics the student is tracking.
        /// </summary>
        public int TotalTopics { get; set; }

        /// <summary>
        /// Total lessons completed across all subjects.
        /// </summary>
        public int LessonsCompleted { get; set; }

        /// <summary>
        /// Number of topics that need attention (low mastery).
        /// </summary>
        public int AreasNeedingAttentionCount { get; set; }

        /// <summary>
        /// Recommended next lesson based on mastery and performance.
        /// </summary>
        public NextLessonRecommendationDto? RecommendedNextLesson { get; set; }

        /// <summary>
        /// List of topics needing attention, ordered by priority (lowest mastery first).
        /// Limited to top 5.
        /// </summary>
        public List<RevisionAdviceDto> AreasNeedingAttention { get; set; } = new();

        /// <summary>
        /// Motivational guidance for the session.
        /// </summary>
        public MotivationalGuidanceDto? Guidance { get; set; }

        /// <summary>
        /// Mastery heatmap data for visualization.
        /// Each item represents a topic with mastery score for color coding.
        /// </summary>
        public List<HeatmapItemDto> MasteryHeatmap { get; set; } = new();
    }

    /// <summary>
    /// A single topic's mastery data for heatmap visualization.
    /// </summary>
    public class HeatmapItemDto
    {
        public Guid TopicId { get; set; }

        public string TopicName { get; set; } = default!;

        public string SubjectName { get; set; } = default!;

        /// <summary>
        /// Mastery score as percentage (0-100).
        /// </summary>
        public decimal MasteryPercent { get; set; }

        /// <summary>
        /// Severity bucket: "strong" (80-100), "moderate" (60-79), "weak" (40-59), or "critical" (0-39).
        /// </summary>
        public string SeverityBucket { get; set; } = default!;
    }
}
