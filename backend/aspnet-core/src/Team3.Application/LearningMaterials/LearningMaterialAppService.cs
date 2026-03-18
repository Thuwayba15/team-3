using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Ardalis.GuardClauses;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.AI;
using Team3.Configuration;
using Team3.Enums;
using Team3.LearningMaterials.Dto;

namespace Team3.LearningMaterials;

[AbpAuthorize]
public class LearningMaterialAppService : Team3AppServiceBase, ILearningMaterialAppService
{
    private static readonly string[] RequiredTranslationLanguageCodes = ["zu", "st", "af"];

    private readonly IRepository<Subject, Guid> _subjectRepository;
    private readonly IRepository<Topic, Guid> _topicRepository;
    private readonly IRepository<Lesson, Guid> _lessonRepository;
    private readonly IRepository<LessonTranslation, Guid> _lessonTranslationRepository;
    private readonly IRepository<SourceMaterial, Guid> _sourceMaterialRepository;
    private readonly IRepository<Language, Guid> _languageRepository;
    private readonly ITextTranslationService _translationService;
    private readonly IValidator<UploadTextLearningMaterialInput> _validator;

    public LearningMaterialAppService(
        IRepository<Subject, Guid> subjectRepository,
        IRepository<Topic, Guid> topicRepository,
        IRepository<Lesson, Guid> lessonRepository,
        IRepository<LessonTranslation, Guid> lessonTranslationRepository,
        IRepository<SourceMaterial, Guid> sourceMaterialRepository,
        IRepository<Language, Guid> languageRepository,
        ITextTranslationService translationService,
        IValidator<UploadTextLearningMaterialInput> validator)
    {
        _subjectRepository = subjectRepository;
        _topicRepository = topicRepository;
        _lessonRepository = lessonRepository;
        _lessonTranslationRepository = lessonTranslationRepository;
        _sourceMaterialRepository = sourceMaterialRepository;
        _languageRepository = languageRepository;
        _translationService = translationService;
        _validator = validator;
    }

    public async Task<UploadTextLearningMaterialOutput> UploadTextMaterialAsync(UploadTextLearningMaterialInput input)
    {
        Guard.Against.Null(input);
        await ValidateInputAsync(input);

        var subject = await _subjectRepository.FirstOrDefaultAsync(input.SubjectId)
            ?? throw new UserFriendlyException("Subject was not found.");

        var sourceLanguage = await GetLanguageByCodeAsync(input.SourceLanguageCode);
        var targetLanguages = await GetRequiredTargetLanguagesAsync(sourceLanguage.Code);

        var sourceMaterial = new SourceMaterial(
            Guid.NewGuid(),
            AbpSession.GetUserId(),
            input.Title,
            BuildTextMaterialUrl(input.Title),
            SourceMaterialType.Text,
            DateTime.UtcNow,
            sourceLanguage.Id,
            input.GradeLevel ?? subject.GradeLevel,
            subject.Id,
            input.Description);

        sourceMaterial.MarkProcessing();
        await _sourceMaterialRepository.InsertAsync(sourceMaterial);

        var topic = await ResolveTopicAsync(subject, input);

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

        var translationDtos = new List<LessonTranslationDto>();

        var sourceTranslation = new LessonTranslation(
            Guid.NewGuid(),
            lesson.Id,
            sourceLanguage.Id,
            input.Title,
            input.Content,
            input.Summary,
            input.Examples,
            input.RevisionSummary,
            isAutoTranslated: false);

        await _lessonTranslationRepository.InsertAsync(sourceTranslation);
        translationDtos.Add(MapTranslationDto(sourceLanguage, sourceTranslation));

        foreach (var targetLanguage in targetLanguages)
        {
            var translatedTitle = await _translationService.TranslateTextAsync(input.Title, sourceLanguage.Code, targetLanguage.Code);
            var translatedContent = await _translationService.TranslateTextAsync(input.Content, sourceLanguage.Code, targetLanguage.Code);
            var translatedSummary = await _translationService.TranslateTextAsync(input.Summary ?? string.Empty, sourceLanguage.Code, targetLanguage.Code);
            var translatedExamples = await _translationService.TranslateTextAsync(input.Examples ?? string.Empty, sourceLanguage.Code, targetLanguage.Code);
            var translatedRevisionSummary = await _translationService.TranslateTextAsync(input.RevisionSummary ?? string.Empty, sourceLanguage.Code, targetLanguage.Code);

            var translation = new LessonTranslation(
                Guid.NewGuid(),
                lesson.Id,
                targetLanguage.Id,
                translatedTitle,
                translatedContent,
                string.IsNullOrWhiteSpace(translatedSummary) ? null : translatedSummary,
                string.IsNullOrWhiteSpace(translatedExamples) ? null : translatedExamples,
                string.IsNullOrWhiteSpace(translatedRevisionSummary) ? null : translatedRevisionSummary,
                isAutoTranslated: true);

            await _lessonTranslationRepository.InsertAsync(translation);
            translationDtos.Add(MapTranslationDto(targetLanguage, translation));
        }

        sourceMaterial.MarkCompleted(lesson.Id, topic.Id);
        await _sourceMaterialRepository.UpdateAsync(sourceMaterial);

        await CurrentUnitOfWork.SaveChangesAsync();

        return new UploadTextLearningMaterialOutput
        {
            SourceMaterialId = sourceMaterial.Id,
            SubjectId = subject.Id,
            TopicId = topic.Id,
            LessonId = lesson.Id,
            Title = lesson.Title,
            SourceLanguageCode = sourceLanguage.Code,
            Translations = translationDtos
        };
    }

    private static LessonTranslationDto MapTranslationDto(Language language, LessonTranslation translation)
    {
        return new LessonTranslationDto
        {
            LanguageCode = language.Code,
            LanguageName = language.Name,
            Title = translation.Title,
            Content = translation.Content,
            Summary = translation.Summary,
            Examples = translation.Examples,
            RevisionSummary = translation.RevisionSummary,
            IsAutoTranslated = translation.IsAutoTranslated
        };
    }

    private async Task ValidateInputAsync(UploadTextLearningMaterialInput input)
    {
        var result = await _validator.ValidateAsync(input);
        if (!result.IsValid)
        {
            var message = string.Join("; ", result.Errors.Select(x => x.ErrorMessage));
            throw new UserFriendlyException(message);
        }
    }

    private async Task<Topic> ResolveTopicAsync(Subject subject, UploadTextLearningMaterialInput input)
    {
        if (input.TopicId.HasValue)
        {
            var topic = await _topicRepository.FirstOrDefaultAsync(input.TopicId.Value)
                ?? throw new UserFriendlyException("Topic was not found.");

            if (topic.SubjectId != subject.Id)
            {
                throw new UserFriendlyException("Provided topic does not belong to the selected subject.");
            }

            return topic;
        }

        var topicName = string.IsNullOrWhiteSpace(input.TopicName) ? input.Title : input.TopicName!;

        var newTopic = new Topic(
            Guid.NewGuid(),
            subject.Id,
            topicName,
            input.DifficultyLevel,
            input.TopicDescription,
            sequenceOrder: 0,
            isActive: true,
            masteryThreshold: 0.70m,
            generatedByAI: false);

        await _topicRepository.InsertAsync(newTopic);
        return newTopic;
    }

    private async Task<Language> GetLanguageByCodeAsync(string code)
    {
        var normalizedCode = code.Trim().ToLowerInvariant();
        var language = await _languageRepository.FirstOrDefaultAsync(x => x.Code == normalizedCode && x.IsActive);

        return language ?? throw new UserFriendlyException($"Language '{code}' is not configured or inactive.");
    }

    private async Task<List<Language>> GetRequiredTargetLanguagesAsync(string sourceLanguageCode)
    {
        var targetLanguages = new List<Language>();

        foreach (var languageCode in RequiredTranslationLanguageCodes)
        {
            if (string.Equals(languageCode, sourceLanguageCode, StringComparison.OrdinalIgnoreCase))
            {
                continue;
            }

            var language = await _languageRepository.FirstOrDefaultAsync(x => x.Code == languageCode && x.IsActive)
                ?? throw new UserFriendlyException($"Required target language '{languageCode}' is not configured or inactive.");

            targetLanguages.Add(language);
        }

        return targetLanguages;
    }

    private static string BuildTextMaterialUrl(string title)
    {
        var slug = title.Trim().ToLowerInvariant().Replace(" ", "-");
        return $"text://materials/{slug}";
    }
}
