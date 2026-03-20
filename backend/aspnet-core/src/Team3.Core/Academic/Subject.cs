using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using System.Collections.Generic;

#nullable enable

namespace Team3.Academic;

public class Subject : FullAuditedEntity<Guid>
{
    public string Name { get; private set; } = default!;

    public string? Description { get; private set; }

    public string GradeLevel { get; private set; } = default!;

    public bool IsActive { get; private set; } = true;

    public virtual ICollection<Topic> Topics { get; private set; } = new List<Topic>();
    public virtual ICollection<SubjectTranslation> Translations { get; private set; } = new List<SubjectTranslation>();
    protected Subject()
    {
    }

    public Subject(Guid id, string name, string gradeLevel, string? description = null, bool isActive = true)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        GradeLevel = Guard.Against.NullOrWhiteSpace(gradeLevel).Trim();
        Description = description?.Trim();
        IsActive = isActive;
    }

    public void UpdateDetails(string name, string gradeLevel, string? description, bool isActive)
    {
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        GradeLevel = Guard.Against.NullOrWhiteSpace(gradeLevel).Trim();
        Description = description?.Trim();
        IsActive = isActive;
    }
}

#nullable disable
