using Abp.Domain.Entities.Auditing;
using Ardalis.GuardClauses;
using System;
using Team3.Academic;
using Team3.Authorization.Users;
using Team3.Configuration;
using Team3.Enums;

namespace Team3.AI;

public class SourceMaterial : CreationAuditedEntity<Guid>
{
    public long UploadedByUserId { get; private set; }

    public string Title { get; private set; } = default!;

    public string? Description { get; private set; }

    public string FileUrl { get; private set; } = default!;

    public SourceMaterialType FileType { get; private set; }

    public DateTime UploadedAt { get; private set; }

    public ProcessingStatus ProcessingStatus { get; private set; } = ProcessingStatus.Pending;

    public Guid? LanguageId { get; private set; }

    public string? GradeLevel { get; private set; }

    public Guid? SubjectId { get; private set; }

    public Guid? GeneratedLessonId { get; private set; }

    public Guid? GeneratedTopicId { get; private set; }

    public virtual User UploadedBy { get; private set; } = default!;

    public virtual Language? Language { get; private set; }

    public virtual Subject? Subject { get; private set; }

    public virtual Lesson? GeneratedLesson { get; private set; }

    public virtual Topic? GeneratedTopic { get; private set; }

    protected SourceMaterial()
    {
    }

    public SourceMaterial(
        Guid id,
        long uploadedByUserId,
        string title,
        string fileUrl,
        SourceMaterialType fileType,
        DateTime uploadedAt,
        Guid? languageId,
        string? gradeLevel,
        Guid? subjectId,
        string? description = null)
    {
        Id = id == Guid.Empty ? Guid.NewGuid() : id;
        UploadedByUserId = Guard.Against.NegativeOrZero(uploadedByUserId);
        Title = Guard.Against.NullOrWhiteSpace(title).Trim();
        Description = description?.Trim();
        FileUrl = Guard.Against.NullOrWhiteSpace(fileUrl).Trim();
        FileType = fileType;
        UploadedAt = uploadedAt;
        LanguageId = languageId;
        GradeLevel = gradeLevel?.Trim();
        SubjectId = subjectId;
    }

    public void MarkProcessing()
    {
        ProcessingStatus = ProcessingStatus.Processing;
    }

    public void MarkCompleted(Guid? generatedLessonId, Guid? generatedTopicId)
    {
        ProcessingStatus = ProcessingStatus.Completed;
        GeneratedLessonId = generatedLessonId;
        GeneratedTopicId = generatedTopicId;
    }

    public void MarkFailed()
    {
        ProcessingStatus = ProcessingStatus.Failed;
    }
}
