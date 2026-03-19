using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Enums;

namespace Team3.Domain.Assessment
{
    public class StudentAssessmentAttempt : CreationAuditedEntity<Guid>
    {
        public long StudentId { get; private set; }

        public Guid AssessmentId { get; private set; }

        public AssessmentType AssessmentType { get; private set; }

        public Guid SubjectId { get; private set; }

        public Guid TopicId { get; private set; }

        public Guid? LessonId { get; private set; }

        public decimal Score { get; private set; }

        public decimal TotalMarks { get; private set; }

        public decimal Percentage { get; private set; }

        public DifficultyLevel AssignedDifficultyLevel { get; private set; }

        public bool Passed { get; private set; }

        public DateTime SubmittedAt { get; private set; }

        public int AttemptNumber { get; private set; }

        public virtual Assessment Assessment { get; private set; } = default!;

        protected StudentAssessmentAttempt()
        {
        }

        public StudentAssessmentAttempt(
            Guid id,
            long studentId,
            Guid assessmentId,
            AssessmentType assessmentType,
            Guid subjectId,
            Guid topicId,
            Guid? lessonId,
            decimal score,
            decimal totalMarks,
            decimal percentage,
            DifficultyLevel assignedDifficultyLevel,
            bool passed,
            int attemptNumber)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            StudentId = Guard.Against.NegativeOrZero(studentId);
            AssessmentId = Guard.Against.Default(assessmentId);
            AssessmentType = assessmentType;
            SubjectId = Guard.Against.Default(subjectId);
            TopicId = Guard.Against.Default(topicId);
            LessonId = lessonId;
            Score = score;
            TotalMarks = totalMarks;
            Percentage = percentage;
            AssignedDifficultyLevel = assignedDifficultyLevel;
            Passed = passed;
            SubmittedAt = DateTime.UtcNow;
            AttemptNumber = Guard.Against.NegativeOrZero(attemptNumber);
        }
    }
}
