using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;

namespace Team3.Domain.Assessment
{
    public class StudentAssessmentAnswer : CreationAuditedEntity<Guid>
    {
        public Guid AttemptId { get; private set; }

        public Guid QuestionId { get; private set; }

        public string? SelectedOption { get; private set; }

        public string? AnswerText { get; private set; }

        public bool IsCorrect { get; private set; }

        public decimal MarksAwarded { get; private set; }

        public virtual StudentAssessmentAttempt Attempt { get; private set; } = default!;

        public virtual Question Question { get; private set; } = default!;

        protected StudentAssessmentAnswer()
        {
        }

        public StudentAssessmentAnswer(
            Guid id,
            Guid attemptId,
            Guid questionId,
            string? selectedOption,
            string? answerText,
            bool isCorrect,
            decimal marksAwarded)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            AttemptId = Guard.Against.Default(attemptId);
            QuestionId = Guard.Against.Default(questionId);
            SelectedOption = selectedOption?.Trim();
            AnswerText = answerText?.Trim();
            IsCorrect = isCorrect;
            MarksAwarded = marksAwarded;
        }
    }
}
