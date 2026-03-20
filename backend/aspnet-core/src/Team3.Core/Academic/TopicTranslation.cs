using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Configuration;

#nullable enable

namespace Team3.Academic;

/// <summary>
/// Translation for Topic names and descriptions in multiple languages.
/// </summary>
public class TopicTranslation : AuditedEntity<Guid>
{
    public Guid TopicId { get; private set; }

    public Guid LanguageId { get; private set; }

    public string Name { get; private set; } = default!;

    public string? Description { get; private set; }

    public bool IsAutoTranslated { get; private set; }

    public virtual Topic Topic { get; private set; } = default!;

    public virtual Language Language { get; private set; } = default!;

    protected TopicTranslation()
    {
    }

    public TopicTranslation(
        Guid id,
        Guid topicId,
        Guid languageId,
        string name,
        string? description = null,
        bool isAutoTranslated = false)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        TopicId = Guard.Against.Default(topicId, nameof(topicId));
        LanguageId = Guard.Against.Default(languageId, nameof(languageId));
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        Description = description?.Trim();
        IsAutoTranslated = isAutoTranslated;
    }

    public void Update(string name, string? description)
    {
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        Description = description?.Trim();
    }
}

#nullable disable
