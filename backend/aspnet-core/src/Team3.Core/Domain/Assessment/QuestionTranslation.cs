using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Configuration;

namespace Team3.Domain.Assessment
{
    public class QuestionTranslation : AuditedEntity<Guid>
    {
        public Guid QuestionId { get; private set; }
        public Guid LanguageId { get; private set; }
        public string QuestionText { get; private set; } = default!;
        public string? OptionA { get; private set; }
        public string? OptionB { get; private set; }
        public string? OptionC { get; private set; }
        public string? OptionD { get; private set; }
        public string? HintText { get; private set; }
        public string? ExplanationText { get; private set; }

        public virtual Question Question { get; private set; } = default!;
        public virtual Language Language { get; private set; } = default!;

        protected QuestionTranslation() { }

        public QuestionTranslation(
            Guid id,
            Guid questionId,
            Guid languageId,
            string questionText,
            string? optionA,
            string? optionB,
            string? optionC,
            string? optionD,
            string? hintText,
            string? explanationText)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            QuestionId = Guard.Against.Default(questionId);
            LanguageId = Guard.Against.Default(languageId);
            QuestionText = Guard.Against.NullOrWhiteSpace(questionText).Trim();
            OptionA = optionA?.Trim();
            OptionB = optionB?.Trim();
            OptionC = optionC?.Trim();
            OptionD = optionD?.Trim();
            HintText = hintText?.Trim();
            ExplanationText = explanationText?.Trim();
        }
    }
}