using Abp.Domain.Entities.Auditing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.Domain.Students
{
    namespace Team3.Students
    {
        public class StudentSubject : FullAuditedEntity<Guid>
        {
            // Link to the Student User ID StudentProfile/AbpUser
            public long UserId { get; private set; }

            // Link to the Subject ID
            public Guid SubjectId { get; private set; }

            // Core tracking metrics for the AI
            public double Progress { get; private set; }
            public int MasteryScore { get; private set; }

            protected StudentSubject() { }

            public StudentSubject(long userId, Guid subjectId)
            {
                UserId = userId;
                SubjectId = subjectId;
                Progress = 0;
                MasteryScore = 0;
            }

            /// <summary>Updates the student's progress and mastery score for this subject.</summary>
            public void UpdateProgress(double progress, int masteryScore)
            {
                Progress = Math.Clamp(progress, 0, 100);
                MasteryScore = Math.Clamp(masteryScore, 0, 100);
            }
        }
    }
}
