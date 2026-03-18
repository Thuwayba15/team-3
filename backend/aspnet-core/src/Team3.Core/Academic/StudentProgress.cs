using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Academic
{
    public class StudentProgress : AuditedEntity<Guid>
    {
        public long StudentId { get; private set; }

        public Guid SubjectId { get; private set; }

        public decimal MasteryScore { get; private set; }

        public string ProgressStatus { get; private set; } = "NotStarted";

        public decimal LastAssessmentScore { get; private set; }

        public int AttemptCount { get; private set; }

        public bool NeedsIntervention { get; private set; }

        public DateTime UpdatedAt { get; private set; }

        public int CompletedLessonCount { get; private set; }

        public bool RevisionNeeded { get; private set; }

        public virtual Subject Subject { get; private set; } = default!;

        protected StudentProgress() { }

        public StudentProgress(Guid id, long studentId, Guid subjectId)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            StudentId = Guard.Against.NegativeOrZero(studentId);
            SubjectId = Guard.Against.Default(subjectId);
            UpdatedAt = DateTime.UtcNow;
        }

        public void UpdateProgress(
            decimal masteryScore,
            string progressStatus,
            decimal lastAssessmentScore,
            int attemptCount,
            bool needsIntervention,
            int completedLessonCount,
            bool revisionNeeded)
        {
            MasteryScore = masteryScore;
            ProgressStatus = Guard.Against.NullOrWhiteSpace(progressStatus);
            LastAssessmentScore = lastAssessmentScore;
            AttemptCount = attemptCount;
            NeedsIntervention = needsIntervention;
            CompletedLessonCount = completedLessonCount;
            RevisionNeeded = revisionNeeded;
            UpdatedAt = DateTime.UtcNow;
        }
    }
}
