using System;

namespace Team3.LearningMaterials.Dto
{
    /// <summary>
    /// Revision advice for a topic the student needs to strengthen.
    /// Includes deterministic identification with optional AI-enhanced action wording.
    /// </summary>
    public class RevisionAdviceDto
    {
        public Guid TopicId { get; set; }

        public string TopicName { get; set; } = default!;

        public string SubjectName { get; set; } = default!;

        /// <summary>
        /// Current mastery score as a percentage (0-100).
        /// </summary>
        public decimal MasteryPercent { get; set; }

        /// <summary>
        /// Deterministic rule-based action (e.g., "Review the foundational lesson").
        /// </summary>
        public string RuleBasisAction { get; set; } = default!;

        /// <summary>
        /// Optional AI-enhanced action wording, in the student's preferred language.
        /// Falls back to RuleBasisAction if AI is unavailable.
        /// </summary>
        public string? AiEnhancedAction { get; set; }

        /// <summary>
        /// Optional recommended lesson ID for this topic (if available).
        /// </summary>
        public Guid? RecommendedLessonId { get; set; }

        /// <summary>
        /// Optional recommended lesson title (if available).
        /// </summary>
        public string? RecommendedLessonTitle { get; set; }

        /// <summary>
        /// Returns the action to display: prefers AI-enhanced version, falls back to rule-based.
        /// </summary>
        public string GetAction() => !string.IsNullOrWhiteSpace(AiEnhancedAction)
            ? AiEnhancedAction
            : RuleBasisAction;
    }
}
