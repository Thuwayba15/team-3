using System;

namespace Team3.LearningMaterials.Dto
{
    /// <summary>
    /// Recommendation for the student's next lesson based on mastery and performance.
    /// Includes deterministic rule-based selection with optional AI-enhanced explanation.
    /// </summary>
    public class NextLessonRecommendationDto
    {
        public Guid LessonId { get; set; }

        public string Title { get; set; } = default!;

        public string TopicName { get; set; } = default!;

        public string SubjectName { get; set; } = default!;

        public int EstimatedMinutes { get; set; }

        /// <summary>
        /// Deterministic rule-based reason (e.g., "Low mastery in Geometry").
        /// </summary>
        public string RuleBasisReason { get; set; } = default!;

        /// <summary>
        /// Optional AI-enhanced explanation of why this lesson is recommended, in the student's preferred language.
        /// Falls back to RuleBasisReason if AI is unavailable.
        /// </summary>
        public string? AiEnhancedExplanation { get; set; }

        /// <summary>
        /// Returns the explanation to display: prefers AI-enhanced version, falls back to rule-based.
        /// </summary>
        public string GetExplanation() => !string.IsNullOrWhiteSpace(AiEnhancedExplanation) 
            ? AiEnhancedExplanation 
            : RuleBasisReason;
    }
}
