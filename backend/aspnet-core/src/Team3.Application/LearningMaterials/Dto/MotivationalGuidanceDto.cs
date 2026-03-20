namespace Team3.LearningMaterials.Dto
{
    /// <summary>
    /// Motivational and contextual guidance for the student.
    /// Includes deterministic encouragement with optional AI-enhanced personalization.
    /// </summary>
    public class MotivationalGuidanceDto
    {
        /// <summary>
        /// Deterministic encouragement message based on overall progress.
        /// </summary>
        public string BaseMessage { get; set; } = default!;

        /// <summary>
        /// Optional AI-enhanced motivational message personalized to the student,
        /// in the student's preferred language.
        /// Falls back to BaseMessage if AI is unavailable.
        /// </summary>
        public string? AiEnhancedMessage { get; set; }

        /// <summary>
        /// Returns the message to display: prefers AI-enhanced version, falls back to base.
        /// </summary>
        public string GetMessage() => !string.IsNullOrWhiteSpace(AiEnhancedMessage)
            ? AiEnhancedMessage
            : BaseMessage;
    }
}
