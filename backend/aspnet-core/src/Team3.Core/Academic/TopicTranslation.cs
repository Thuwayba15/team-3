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
    public class TopicTranslation : AuditedEntity<Guid>
    {
        public Guid TopicId { get; private set; }
        public Guid LanguageId { get; private set; }
        public string Name { get; private set; } = default!;
        public string? Description { get; private set; }
        public bool IsAutoTranslated { get; private set; }

        public virtual Topic Topic { get; private set; } = default!;
        public virtual Language Language { get; private set; } = default!;

        protected TopicTranslation() { }

        public TopicTranslation(
            Guid id,
            Guid topicId,
            Guid languageId,
            string name,
            string? description,
            bool isAutoTranslated)
        {
            Id = id == Guid.Empty ? Guid.NewGuid() : id;
            TopicId = Guard.Against.Default(topicId);
            LanguageId = Guard.Against.Default(languageId);
            Name = Guard.Against.NullOrWhiteSpace(name).Trim();
            Description = description?.Trim();
            IsAutoTranslated = isAutoTranslated;
        }
    }
}
