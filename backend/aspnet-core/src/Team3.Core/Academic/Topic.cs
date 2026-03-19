using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;
using Team3.Domain.Assessment;
using Team3.Enums;

#nullable enable

namespace Team3.Academic;

public class Topic : FullAuditedEntity<Guid>
{
    public Guid SubjectId { get; private set; }

    public string Name { get; private set; } = default!;

    public string? Description { get; private set; }

    public DifficultyLevel DifficultyLevel { get; private set; }

    public int SequenceOrder { get; private set; }

    public bool IsActive { get; private set; } = true;

    public decimal MasteryThreshold { get; private set; } = 0.70m;

    public bool GeneratedByAI { get; private set; }

    public virtual Subject Subject { get; private set; } = default!;

    public virtual ICollection<Lesson> Lessons { get; private set; } = new List<Lesson>();
    public virtual ICollection<Assessment> Assessments { get; private set; } = new List<Assessment>();
    protected Topic()
    {
    }

    public Topic(
        Guid id,
        Guid subjectId,
        string name,
        DifficultyLevel difficultyLevel,
        string? description = null,
        int sequenceOrder = 0,
        bool isActive = true,
        decimal masteryThreshold = 0.70m,
        bool generatedByAI = false)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        SubjectId = Guard.Against.Default(subjectId);
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        Description = description?.Trim();
        DifficultyLevel = difficultyLevel;
        SequenceOrder = sequenceOrder;
        IsActive = isActive;
        MasteryThreshold = masteryThreshold;
        GeneratedByAI = generatedByAI;
    }

    public void UpdateDetails(
        string name,
        DifficultyLevel difficultyLevel,
        string? description,
        int sequenceOrder,
        bool isActive,
        decimal masteryThreshold)
    {
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        Description = description?.Trim();
        DifficultyLevel = difficultyLevel;
        SequenceOrder = sequenceOrder;
        IsActive = isActive;
        MasteryThreshold = masteryThreshold;
    }
}

#nullable disable
