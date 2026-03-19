using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Enums;

namespace Team3.Academic;

public class LessonMaterial : CreationAuditedEntity<Guid>
{
    public Guid LessonId { get; private set; }

    public string Name { get; private set; } = default!;

    public MaterialType MaterialType { get; private set; }

    public string Url { get; private set; } = default!;

    public DateTime UploadedAt { get; private set; }

    public virtual Lesson Lesson { get; private set; } = default!;

    protected LessonMaterial()
    {
    }

    public LessonMaterial(Guid id, Guid lessonId, string name, MaterialType materialType, string url, DateTime uploadedAt)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        LessonId = Guard.Against.Default(lessonId);
        Name = Guard.Against.NullOrWhiteSpace(name).Trim();
        MaterialType = materialType;
        Url = Guard.Against.NullOrWhiteSpace(url).Trim();
        UploadedAt = uploadedAt;
    }
}
