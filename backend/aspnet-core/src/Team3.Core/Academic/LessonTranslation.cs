using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Configuration;

#nullable enable

namespace Team3.Academic;

public class LessonTranslation : AuditedEntity<Guid>
{
    public Guid LessonId { get; private set; }

    public Guid LanguageId { get; private set; }

    public string Title { get; private set; } = default!;

    public string Content { get; private set; } = default!;

    public string? Summary { get; private set; }

    public string? Examples { get; private set; }

    public string? RevisionSummary { get; private set; }

    public bool IsAutoTranslated { get; private set; }

    public virtual Lesson Lesson { get; private set; } = default!;

    public virtual Language Language { get; private set; } = default!;

    protected LessonTranslation()
    {
    }

    public LessonTranslation(
        Guid id,
        Guid lessonId,
        Guid languageId,
        string title,
        string content,
        string? summary,
        string? examples,
        string? revisionSummary,
        bool isAutoTranslated)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        LessonId = Guard.Against.Default(lessonId);
        LanguageId = Guard.Against.Default(languageId);
        Title = Guard.Against.NullOrWhiteSpace(title).Trim();
        Content = Guard.Against.NullOrWhiteSpace(content).Trim();
        Summary = summary?.Trim();
        Examples = examples?.Trim();
        RevisionSummary = revisionSummary?.Trim();
        IsAutoTranslated = isAutoTranslated;
    }

    public void UpdateContent(
        string title,
        string content,
        string? summary,
        string? examples,
        string? revisionSummary,
        bool isAutoTranslated)
    {
        Title = Guard.Against.NullOrWhiteSpace(title).Trim();
        Content = Guard.Against.NullOrWhiteSpace(content).Trim();
        Summary = summary?.Trim();
        Examples = examples?.Trim();
        RevisionSummary = revisionSummary?.Trim();
        IsAutoTranslated = isAutoTranslated;
    }
}

#nullable disable
