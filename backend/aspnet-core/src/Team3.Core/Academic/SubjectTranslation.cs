using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Team3.Configuration;

namespace Team3.Academic
{
    public class SubjectTranslation : AuditedEntity<Guid>
    {
        public Guid SubjectId { get; private set; }
        public Guid LanguageId { get; private set; }
        public string Name { get; private set; } = default!;
        public string? Description { get; private set; }
        public bool IsAutoTranslated { get; private set; }

        public virtual Subject Subject { get; private set; } = default!;
        public virtual Language Language { get; private set; } = default!;

        protected SubjectTranslation() { }

        public SubjectTranslation(
            Guid id,
            Guid subjectId,
            Guid languageId,
            string name,
            string? description,
            bool isAutoTranslated)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            SubjectId = Guard.Against.Default(subjectId);
            LanguageId = Guard.Against.Default(languageId);
            Name = Guard.Against.NullOrWhiteSpace(name).Trim();
            Description = description?.Trim();
            IsAutoTranslated = isAutoTranslated;
        }
    }
}
