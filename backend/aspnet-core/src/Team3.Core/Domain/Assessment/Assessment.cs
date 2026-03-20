using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Enums;

namespace Team3.Domain.Assessment
{
    public class Assessment : FullAuditedEntity<Guid>
    {
        public Guid TopicId { get; private set; }
        public Guid? LessonId { get; private set; } // null for diagnostic
        public string Title { get; private set; } = default!;
        public string? Description { get; private set; }
        public AssessmentType AssessmentType { get; private set; }
        public DifficultyLevel DifficultyLevel { get; private set; }
        public decimal TotalMarks { get; private set; }
        public bool IsPublished { get; private set; }
        public bool GeneratedByAI { get; private set; }

        public virtual Team3.Academic.Topic Topic { get; private set; } = default!;
        public virtual Team3.Academic.Lesson? Lesson { get; private set; }
        public virtual ICollection<Question> Questions { get; private set; } = new List<Question>();

        protected Assessment() { }

        public Assessment(
            Guid id,
            Guid topicId,
            Guid? lessonId,
            string title,
            AssessmentType assessmentType,
            DifficultyLevel difficultyLevel,
            bool isPublished = false,
            bool generatedByAI = true,
            string? description = null)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            TopicId = Guard.Against.Default(topicId);
            LessonId = lessonId;
            Title = Guard.Against.NullOrWhiteSpace(title).Trim();
            AssessmentType = assessmentType;
            DifficultyLevel = difficultyLevel;
            IsPublished = isPublished;
            GeneratedByAI = generatedByAI;
            Description = description?.Trim();
        }

        public void SetTotalMarks(decimal totalMarks)
        {
            TotalMarks = totalMarks;
        }
    }
}
