using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Configuration;

#nullable enable

namespace Team3.Academic;

/// <summary>
/// Translation for Subject names and descriptions in multiple languages.
/// </summary>
public class SubjectTranslation : AuditedEntity<Guid>
{
    public Guid SubjectId { get; private set; }

    public Guid LanguageId { get; private set; }

    public string Name { get; private set; } = default!;

    public string? Description { get; private set; }

    public bool IsAutoTranslated { get; private set; }

    public virtual Subject Subject { get; private set; } = default!;

    public virtual Language Language { get; private set; } = default!;

    protected SubjectTranslation()
    {
    }

    public SubjectTranslation(
        Guid id,
        Guid subjectId,
        Guid languageId,
        string name,
        string? description = null,
        bool isAutoTranslated = false)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        SubjectId = Guard.Against.Default(subjectId, nameof(subjectId));
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
