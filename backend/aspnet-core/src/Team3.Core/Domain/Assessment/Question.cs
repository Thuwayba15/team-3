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
    public class Question : FullAuditedEntity<Guid>
    {
        public Guid AssessmentId { get; private set; }
        public QuestionType QuestionType { get; private set; }
        public DifficultyLevel DifficultyLevel { get; private set; }
        public string? CorrectAnswer { get; private set; }
        public string? Explanation { get; private set; }
        public decimal Marks { get; private set; } = 1;
        public int SequenceOrder { get; private set; }
        public bool IsActive { get; private set; } = true;
        public bool GeneratedByAI { get; private set; }

        public virtual Assessment Assessment { get; private set; } = default!;
        public virtual ICollection<QuestionTranslation> Translations { get; private set; } = new List<QuestionTranslation>();

        protected Question() { }

        public Question(
            Guid id,
            Guid assessmentId,
            QuestionType questionType,
            DifficultyLevel difficultyLevel,
            string? correctAnswer,
            string? explanation,
            decimal marks,
            int sequenceOrder,
            bool generatedByAI = true)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            AssessmentId = Guard.Against.Default(assessmentId);
            QuestionType = questionType;
            DifficultyLevel = difficultyLevel;
            CorrectAnswer = correctAnswer?.Trim();
            Explanation = explanation?.Trim();
            Marks = marks;
            SequenceOrder = sequenceOrder;
            GeneratedByAI = generatedByAI;
        }
    }
}
