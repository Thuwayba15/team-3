using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Authorization;
using Team3.Configuration;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials;

[AbpAuthorize(PermissionNames.Pages_Admin_Curriculum)]
public class CurriculumAdminAppService : Team3AppServiceBase
{
    private readonly IRepository<Subject, Guid> _subjectRepository;
    private readonly IRepository<Topic, Guid> _topicRepository;
    private readonly IRepository<Lesson, Guid> _lessonRepository;
    private readonly IRepository<LessonTranslation, Guid> _translationRepository;
    private readonly IRepository<Language, Guid> _languageRepository;

    public CurriculumAdminAppService(
        IRepository<Subject, Guid> subjectRepository,
        IRepository<Topic, Guid> topicRepository,
        IRepository<Lesson, Guid> lessonRepository,
        IRepository<LessonTranslation, Guid> translationRepository,
        IRepository<Language, Guid> languageRepository)
    {
        _subjectRepository = subjectRepository;
        _topicRepository = topicRepository;
        _lessonRepository = lessonRepository;
        _translationRepository = translationRepository;
        _languageRepository = languageRepository;
    }

    public async Task<LifeSciencesCurriculumDto> GetLifeSciencesCurriculumAsync()
    {
        var subject = await GetLifeSciencesSubjectAsync();
        var topics = await _topicRepository.GetAllListAsync(x => x.SubjectId == subject.Id);
        var lessons = await _lessonRepository.GetAllListAsync();

        return new LifeSciencesCurriculumDto
        {
            SubjectId = subject.Id,
            SubjectName = subject.Name,
            GradeLevel = subject.GradeLevel,
            Description = subject.Description,
            Topics = topics
                .OrderBy(x => x.SequenceOrder)
                .Select(topic => new CurriculumTopicDetailDto
                {
                    Id = topic.Id,
                    Name = topic.Name,
                    Description = topic.Description,
                    DifficultyLevel = topic.DifficultyLevel,
                    SequenceOrder = topic.SequenceOrder,
                    IsActive = topic.IsActive,
                    MasteryThreshold = topic.MasteryThreshold,
                    Lessons = lessons
                        .Where(lesson => lesson.TopicId == topic.Id)
                        .OrderBy(lesson => lesson.Title)
                        .Select(MapLessonSummary)
                        .ToList()
                })
                .ToList()
        };
    }

    public async Task<TopicDto> CreateTopicAsync(CurriculumTopicInput input)
    {
        var subject = await GetLifeSciencesSubjectAsync();

        var topic = new Topic(
            Guid.NewGuid(),
            subject.Id,
            input.Name,
            input.DifficultyLevel,
            input.Description,
            input.SequenceOrder,
            input.IsActive,
            input.MasteryThreshold,
            generatedByAI: false);

        await _topicRepository.InsertAsync(topic);
        await CurrentUnitOfWork.SaveChangesAsync();

        return MapTopicDto(topic);
    }

    public async Task<TopicDto> UpdateTopicAsync(Guid topicId, CurriculumTopicInput input)
    {
        var topic = await _topicRepository.GetAsync(topicId);
        await EnsureLifeSciencesTopicAsync(topic);

        topic.UpdateDetails(
            input.Name,
            input.DifficultyLevel,
            input.Description,
            input.SequenceOrder,
            input.IsActive,
            input.MasteryThreshold);

        await _topicRepository.UpdateAsync(topic);
        return MapTopicDto(topic);
    }

    public async Task<LessonDetailDto> CreateLessonAsync(Guid topicId, CurriculumLessonInput input)
    {
        var topic = await _topicRepository.GetAsync(topicId);
        await EnsureLifeSciencesTopicAsync(topic);

        var lesson = new Lesson(
            Guid.NewGuid(),
            topic.Id,
            input.Title,
            input.DifficultyLevel,
            input.Summary,
            input.LearningObjective,
            input.RevisionSummary,
            input.EstimatedMinutes,
            input.IsPublished,
            generatedByAI: false);

        await _lessonRepository.InsertAsync(lesson);
        await CurrentUnitOfWork.SaveChangesAsync();

        return await BuildLessonDetailAsync(lesson);
    }

    public async Task<LessonDetailDto> GetLessonAsync(Guid lessonId)
    {
        var lesson = await _lessonRepository.GetAsync(lessonId);
        var topic = await _topicRepository.GetAsync(lesson.TopicId);
        await EnsureLifeSciencesTopicAsync(topic);

        return await BuildLessonDetailAsync(lesson);
    }

    public async Task<LessonDetailDto> UpdateLessonAsync(Guid lessonId, CurriculumLessonInput input)
    {
        var lesson = await _lessonRepository.GetAsync(lessonId);
        var topic = await _topicRepository.GetAsync(lesson.TopicId);
        await EnsureLifeSciencesTopicAsync(topic);

        lesson.UpdateDetails(
            input.Title,
            input.DifficultyLevel,
            input.Summary,
            input.LearningObjective,
            input.RevisionSummary,
            input.EstimatedMinutes,
            input.IsPublished);

        await _lessonRepository.UpdateAsync(lesson);
        return await BuildLessonDetailAsync(lesson);
    }

    public async Task<LessonDetailDto> UpsertLessonTranslationAsync(Guid lessonId, CurriculumLessonTranslationInput input)
    {
        var lesson = await _lessonRepository.GetAsync(lessonId);
        var topic = await _topicRepository.GetAsync(lesson.TopicId);
        await EnsureLifeSciencesTopicAsync(topic);

        var languageCode = input.LanguageCode.Trim().ToLowerInvariant();
        var language = await _languageRepository.FirstOrDefaultAsync(x => x.Code == languageCode && x.IsActive)
            ?? throw new UserFriendlyException($"Language '{input.LanguageCode}' is not configured.");

        var translation = await _translationRepository.FirstOrDefaultAsync(x => x.LessonId == lessonId && x.LanguageId == language.Id);

        if (translation == null)
        {
            translation = new LessonTranslation(
                Guid.NewGuid(),
                lessonId,
                language.Id,
                input.Title,
                input.Content,
                input.Summary,
                input.Examples,
                input.RevisionSummary,
                isAutoTranslated: false);

            await _translationRepository.InsertAsync(translation);
        }
        else
        {
            translation.UpdateContent(
                input.Title,
                input.Content,
                input.Summary,
                input.Examples,
                input.RevisionSummary,
                isAutoTranslated: false);

            await _translationRepository.UpdateAsync(translation);
        }

        await CurrentUnitOfWork.SaveChangesAsync();
        return await BuildLessonDetailAsync(lesson);
    }

    private async Task<LessonDetailDto> BuildLessonDetailAsync(Lesson lesson)
    {
        var translations = await _translationRepository.GetAllListAsync(x => x.LessonId == lesson.Id);
        var languages = await _languageRepository.GetAllListAsync();
        var languageMap = languages.ToDictionary(x => x.Id);

        return new LessonDetailDto
        {
            Id = lesson.Id,
            TopicId = lesson.TopicId,
            Title = lesson.Title,
            Summary = lesson.Summary,
            LearningObjective = lesson.LearningObjective,
            RevisionSummary = lesson.RevisionSummary,
            DifficultyLevel = lesson.DifficultyLevel,
            EstimatedMinutes = lesson.EstimatedMinutes,
            IsPublished = lesson.IsPublished,
            Translations = translations
                .OrderBy(x => languageMap.TryGetValue(x.LanguageId, out var language) ? language.SortOrder : int.MaxValue)
                .Select(translation => new LessonTranslationSummaryDto
                {
                    LanguageCode = languageMap.TryGetValue(translation.LanguageId, out var language) ? language.Code : "unknown",
                    LanguageName = languageMap.TryGetValue(translation.LanguageId, out var languageName) ? languageName.Name : "Unknown",
                    Title = translation.Title,
                    Content = translation.Content,
                    Summary = translation.Summary,
                    Examples = translation.Examples,
                    RevisionSummary = translation.RevisionSummary,
                    IsAutoTranslated = translation.IsAutoTranslated
                })
                .ToList()
        };
    }

    private async Task EnsureLifeSciencesTopicAsync(Topic topic)
    {
        var subject = await _subjectRepository.GetAsync(topic.SubjectId);
        if (!string.Equals(subject.Name, "Life Sciences", StringComparison.OrdinalIgnoreCase))
        {
            throw new UserFriendlyException("The MVP curriculum service only manages Life Sciences.");
        }
    }

    private async Task<Subject> GetLifeSciencesSubjectAsync()
    {
        return await _subjectRepository.FirstOrDefaultAsync(x => x.Name == "Life Sciences" && x.IsActive)
            ?? throw new UserFriendlyException("Life Sciences subject is not available.");
    }

    private static TopicDto MapTopicDto(Topic topic)
    {
        return new TopicDto
        {
            Id = topic.Id,
            SubjectId = topic.SubjectId,
            Name = topic.Name,
            Description = topic.Description,
            DifficultyLevel = topic.DifficultyLevel,
            SequenceOrder = topic.SequenceOrder,
            IsActive = topic.IsActive
        };
    }

    private static LessonSummaryDto MapLessonSummary(Lesson lesson)
    {
        return new LessonSummaryDto
        {
            Id = lesson.Id,
            TopicId = lesson.TopicId,
            Title = lesson.Title,
            DifficultyLevel = lesson.DifficultyLevel,
            EstimatedMinutes = lesson.EstimatedMinutes,
            IsPublished = lesson.IsPublished
        };
    }
}
