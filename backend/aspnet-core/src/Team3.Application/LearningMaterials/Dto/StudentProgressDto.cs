using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Team3.LearningMaterials.Dto
{
    public class StudentProgressDto
    {
        public Guid Id { get; set; }
        public long StudentId { get; set; }
        public Guid SubjectId { get; set; }
        public string SubjectName { get; set; }
        public decimal MasteryScore { get; set; }
        public string ProgressStatus { get; set; }
        public decimal LastAssessmentScore { get; set; }
        public int AttemptCount { get; set; }
        public bool NeedsIntervention { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CompletedLessonCount { get; set; }
        public bool RevisionNeeded { get; set; }
    }
}
