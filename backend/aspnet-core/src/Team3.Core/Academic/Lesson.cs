using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using Team3.Enums;

#nullable enable

namespace Team3.Academic;

public class Lesson : FullAuditedEntity<Guid>
{
    public Guid TopicId { get; private set; }

    public string Title { get; private set; } = default!;

    public string? Summary { get; private set; }

    public string? LearningObjective { get; private set; }

    public string? RevisionSummary { get; private set; }

    public DifficultyLevel DifficultyLevel { get; private set; }

    public int EstimatedMinutes { get; private set; } = 15;

    public bool IsPublished { get; private set; }

    public bool GeneratedByAI { get; private set; }

    public virtual Topic Topic { get; private set; } = default!;

    public virtual ICollection<LessonMaterial> Materials { get; private set; } = new List<LessonMaterial>();

    public virtual ICollection<LessonTranslation> Translations { get; private set; } = new List<LessonTranslation>();

    protected Lesson()
    {
    }

    public Lesson(
        Guid id,
        Guid topicId,
        string title,
        DifficultyLevel difficultyLevel,
        string? summary = null,
        string? learningObjective = null,
        string? revisionSummary = null,
        int estimatedMinutes = 15,
        bool isPublished = false,
        bool generatedByAI = false)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        TopicId = Guard.Against.Default(topicId);
        Title = Guard.Against.NullOrWhiteSpace(title).Trim();
        DifficultyLevel = difficultyLevel;
        Summary = summary?.Trim();
        LearningObjective = learningObjective?.Trim();
        RevisionSummary = revisionSummary?.Trim();
        EstimatedMinutes = estimatedMinutes;
        IsPublished = isPublished;
        GeneratedByAI = generatedByAI;
    }

    public void UpdateDetails(
        string title,
        DifficultyLevel difficultyLevel,
        string? summary,
        string? learningObjective,
        string? revisionSummary,
        int estimatedMinutes,
        bool isPublished)
    {
        Title = Guard.Against.NullOrWhiteSpace(title).Trim();
        DifficultyLevel = difficultyLevel;
        Summary = summary?.Trim();
        LearningObjective = learningObjective?.Trim();
        RevisionSummary = revisionSummary?.Trim();
        EstimatedMinutes = estimatedMinutes;
        IsPublished = isPublished;
    }
}

#nullable disable
