using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Enums;

namespace Team3.Academic
{
    public class StudentTopicProgress : AuditedEntity<Guid>
    {
        public long StudentId { get; private set; }

        public Guid TopicId { get; private set; }

        public DifficultyLevel AssignedDifficultyLevel { get; private set; }

        public LearningProgressStatus Status { get; private set; }

        public DateTime? UnlockedAt { get; private set; }

        public decimal MasteryScore { get; private set; }

        public bool NeedsRevision { get; private set; }

        protected StudentTopicProgress()
        {
        }

        public StudentTopicProgress(Guid id, long studentId, Guid topicId, DifficultyLevel assignedDifficultyLevel)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            StudentId = Guard.Against.NegativeOrZero(studentId);
            TopicId = Guard.Against.Default(topicId);
            AssignedDifficultyLevel = assignedDifficultyLevel;
            Status = LearningProgressStatus.Locked;
        }

        public void MarkCurrent(DifficultyLevel assignedDifficultyLevel, decimal masteryScore, bool needsRevision)
        {
            AssignedDifficultyLevel = assignedDifficultyLevel;
            MasteryScore = masteryScore;
            NeedsRevision = needsRevision;
            Status = LearningProgressStatus.Current;
            UnlockedAt ??= DateTime.UtcNow;
        }

        public void MarkCompleted(decimal masteryScore, bool needsRevision)
        {
            MasteryScore = masteryScore;
            NeedsRevision = needsRevision;
            Status = LearningProgressStatus.Completed;
            UnlockedAt ??= DateTime.UtcNow;
        }
    }
}
