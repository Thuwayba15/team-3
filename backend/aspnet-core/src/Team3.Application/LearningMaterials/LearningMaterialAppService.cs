using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.AI;
using Team3.Configuration;
using Team3.Enums;
using Team3.LearningMaterials.Dto;
using Abp.Dependency;

namespace Team3.LearningMaterials;

[AbpAllowAnonymous]
public class LearningMaterialAppService : Team3AppServiceBase, ILearningMaterialAppService
{
    private static readonly string[] RequiredTranslationLanguageCodes = ["zu", "st", "af"];

    // Property injection — ABP resolves these automatically, no constructor needed
    public IRepository<Subject, Guid> SubjectRepository { get; set; }
    public IRepository<Topic, Guid> TopicRepository { get; set; }
    public IRepository<Lesson, Guid> LessonRepository { get; set; }
    public IRepository<LessonTranslation, Guid> LessonTranslationRepository { get; set; }
    public IRepository<SourceMaterial, Guid> SourceMaterialRepository { get; set; }
    public IRepository<Language, Guid> LanguageRepository { get; set; }


    


    [AbpAllowAnonymous]
    public async Task<UploadTextLearningMaterialOutput> UploadTextMaterialAsync(UploadTextLearningMaterialInput input)
    {
        try
        {
            var TranslationService = new GeminiPlaceholderTranslationService(SettingManager);

            var userId = AbpSession.UserId
                ?? throw new UserFriendlyException("User must be logged in.");

            var subject = await SubjectRepository.FirstOrDefaultAsync(input.SubjectId)
                ?? throw new UserFriendlyException("Subject was not found.");

            var sourceLanguage = await GetLanguageByCodeAsync(input.SourceLanguageCode);
            var targetLanguages = await GetRequiredTargetLanguagesAsync(sourceLanguage.Code);

            var sourceMaterial = new SourceMaterial(
                Guid.NewGuid(),
                userId,
                input.Title,
                BuildTextMaterialUrl(input.Title),
                SourceMaterialType.Text,
                DateTime.UtcNow,
                sourceLanguage.Id,
                input.GradeLevel ?? subject.GradeLevel,
                subject.Id,
                input.Description);

            sourceMaterial.MarkProcessing();
            await SourceMaterialRepository.InsertAsync(sourceMaterial);

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

            await LessonRepository.InsertAsync(lesson);

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

            await LessonTranslationRepository.InsertAsync(sourceTranslation);
            translationDtos.Add(MapTranslationDto(sourceLanguage, sourceTranslation));

            foreach (var targetLanguage in targetLanguages)
            {
                var translationTasks = await Task.WhenAll(
                    TranslationService.TranslateTextAsync(input.Title, sourceLanguage.Code, targetLanguage.Code),
                    TranslationService.TranslateTextAsync(input.Content, sourceLanguage.Code, targetLanguage.Code),
                    TranslationService.TranslateTextAsync(input.Summary ?? string.Empty, sourceLanguage.Code, targetLanguage.Code),
                    TranslationService.TranslateTextAsync(input.Examples ?? string.Empty, sourceLanguage.Code, targetLanguage.Code),
                    TranslationService.TranslateTextAsync(input.RevisionSummary ?? string.Empty, sourceLanguage.Code, targetLanguage.Code)
                );

                var translation = new LessonTranslation(
                    Guid.NewGuid(),
                    lesson.Id,
                    targetLanguage.Id,
                    translationTasks[0],
                    translationTasks[1],
                    string.IsNullOrWhiteSpace(translationTasks[2]) ? null : translationTasks[2],
                    string.IsNullOrWhiteSpace(translationTasks[3]) ? null : translationTasks[3],
                    string.IsNullOrWhiteSpace(translationTasks[4]) ? null : translationTasks[4],
                    isAutoTranslated: true);

                await LessonTranslationRepository.InsertAsync(translation);
                translationDtos.Add(MapTranslationDto(targetLanguage, translation));
            }

            sourceMaterial.MarkCompleted(lesson.Id, topic.Id);
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
        catch (UserFriendlyException)
        {
            throw;
        }
        catch (OperationCanceledException ex)
        {
            Logger.Error("Translation request timed out or was cancelled.", ex);
            throw new UserFriendlyException("The translation request timed out. Please try again.");
        }
        catch (Exception ex)
        {
            Logger.Error(ex.ToString(), ex);
            throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message} | {ex.InnerException?.Message}");
        }
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

    private async Task<Topic> ResolveTopicAsync(Subject subject, UploadTextLearningMaterialInput input)
    {
        if (input.TopicId.HasValue)
        {
            var topic = await TopicRepository.FirstOrDefaultAsync(input.TopicId.Value)
                ?? throw new UserFriendlyException("Topic was not found.");

            if (topic.SubjectId != subject.Id)
                throw new UserFriendlyException("Provided topic does not belong to the selected subject.");

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

        await TopicRepository.InsertAsync(newTopic);
        return newTopic;
    }

    private async Task<Language> GetLanguageByCodeAsync(string code)
    {
        var normalizedCode = code.Trim().ToLowerInvariant();
        var language = await LanguageRepository.FirstOrDefaultAsync(x => x.Code == normalizedCode && x.IsActive);
        return language ?? throw new UserFriendlyException($"Language '{code}' is not configured or inactive.");
    }

    private async Task<List<Language>> GetRequiredTargetLanguagesAsync(string sourceLanguageCode)
    {
        var targetLanguages = new List<Language>();

        foreach (var languageCode in RequiredTranslationLanguageCodes)
        {
            if (string.Equals(languageCode, sourceLanguageCode, StringComparison.OrdinalIgnoreCase))
                continue;

            var language = await LanguageRepository.FirstOrDefaultAsync(x => x.Code == languageCode && x.IsActive)
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