using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Enums;

namespace Team3.Academic
{
    public class StudentLessonProgress : AuditedEntity<Guid>
    {
        public long StudentId { get; private set; }

        public Guid LessonId { get; private set; }

        public Guid SubjectId { get; private set; }

        public Guid TopicId { get; private set; }

        public LearningProgressStatus Status { get; private set; }

        public DateTime? StartedAt { get; private set; }

        public DateTime? CompletedAt { get; private set; }

        public Guid? LastQuizAttemptId { get; private set; }

        protected StudentLessonProgress()
        {
        }

        public StudentLessonProgress(Guid id, long studentId, Guid lessonId, Guid subjectId, Guid topicId)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            StudentId = Guard.Against.NegativeOrZero(studentId);
            LessonId = Guard.Against.Default(lessonId);
            SubjectId = Guard.Against.Default(subjectId);
            TopicId = Guard.Against.Default(topicId);
            Status = LearningProgressStatus.Locked;
        }

        public void MarkCurrent()
        {
            Status = LearningProgressStatus.Current;
            StartedAt ??= DateTime.UtcNow;
        }

        public void MarkCompleted(Guid? lastQuizAttemptId = null)
        {
            Status = LearningProgressStatus.Completed;
            StartedAt ??= DateTime.UtcNow;
            CompletedAt = DateTime.UtcNow;
            LastQuizAttemptId = lastQuizAttemptId;
        }

        public void SetLastQuizAttempt(Guid attemptId)
        {
            LastQuizAttemptId = Guard.Against.Default(attemptId);
        }
    }
}
