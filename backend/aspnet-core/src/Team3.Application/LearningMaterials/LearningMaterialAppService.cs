using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
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

[AbpAllowAnonymous]
public class LearningMaterialAppService : Team3AppServiceBase, ILearningMaterialAppService
{
    private static readonly string[] RequiredLanguageCodes = ["en", "zu", "st", "af"];
    private static readonly DifficultyLevel[] DifficultyLevels = [DifficultyLevel.Easy, DifficultyLevel.Medium, DifficultyLevel.Hard];

    public IRepository<Subject, Guid> SubjectRepository { get; set; }
    public IRepository<Topic, Guid> TopicRepository { get; set; }
    public IRepository<Lesson, Guid> LessonRepository { get; set; }
    public IRepository<LessonTranslation, Guid> LessonTranslationRepository { get; set; }
    public IRepository<SourceMaterial, Guid> SourceMaterialRepository { get; set; }
    public IRepository<Language, Guid> LanguageRepository { get; set; }

    [AbpAllowAnonymous]
    [Abp.Domain.Uow.UnitOfWork(false)]
    public async Task<UploadTextLearningMaterialOutput> UploadTextMaterialAsync(UploadTextLearningMaterialInput input)
    {
        var translationService = new GeminiPlaceholderTranslationService(SettingManager);

        try
        {
            var userId = AbpSession.UserId
                ?? throw new UserFriendlyException("User must be logged in.");

            var subject = await SubjectRepository.FirstOrDefaultAsync(input.SubjectId)
                ?? throw new UserFriendlyException("Subject was not found.");

            var allLanguages = await LanguageRepository.GetAllListAsync(
                x => RequiredLanguageCodes.Contains(x.Code) && x.IsActive);

            var sourceLanguage = allLanguages.FirstOrDefault(x => x.Code == input.SourceLanguageCode.Trim().ToLowerInvariant())
                ?? throw new UserFriendlyException($"Language '{input.SourceLanguageCode}' is not configured or inactive.");

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
            await CurrentUnitOfWork.SaveChangesAsync();

            // -------------------------------------------------------
            // ALL GEMINI CALLS IN PARALLEL
            // Fire off all 3 difficulty rewrites at the same time,
            // and all language translations at the same time
            // -------------------------------------------------------
            var difficultyTasks = DifficultyLevels.Select(async difficulty =>
            {
                var difficultyLabel = difficulty switch
                {
                    DifficultyLevel.Easy => "easy — use simple language, short sentences, basic vocabulary suitable for beginners",
                    DifficultyLevel.Medium => "medium — use clear language with moderate detail and some subject-specific terms",
                    DifficultyLevel.Hard => "hard — use advanced language, technical terms, and in-depth detail suitable for advanced students",
                    _ => "medium"
                };

                var rewritePrompt = $"""
                Rewrite the following educational lesson content at a {difficultyLabel} difficulty level.
                Keep the same facts and meaning but adjust the language complexity accordingly.
                Return only the rewritten content with no commentary.

                Original content:
                {input.Content}
                """;

                var rewrittenContent = await translationService.SendPromptAsync(rewritePrompt);
                var rewrittenTitle = $"{input.Title} ({difficulty})";
                var lessonId = Guid.NewGuid();

                // Translate all non-source languages in parallel
                var languageTasks = allLanguages
                    .Where(l => l.Code != sourceLanguage.Code)
                    .Select(async language =>
                    {
                        var fields = await Task.WhenAll(
                            translationService.TranslateTextAsync(rewrittenTitle, sourceLanguage.Code, language.Code),
                            translationService.TranslateTextAsync(rewrittenContent, sourceLanguage.Code, language.Code),
                            string.IsNullOrWhiteSpace(input.Summary)
                                ? Task.FromResult(string.Empty)
                                : translationService.TranslateTextAsync(input.Summary, sourceLanguage.Code, language.Code),
                            string.IsNullOrWhiteSpace(input.Examples)
                                ? Task.FromResult(string.Empty)
                                : translationService.TranslateTextAsync(input.Examples, sourceLanguage.Code, language.Code),
                            string.IsNullOrWhiteSpace(input.RevisionSummary)
                                ? Task.FromResult(string.Empty)
                                : translationService.TranslateTextAsync(input.RevisionSummary, sourceLanguage.Code, language.Code)
                        );

                        return new LessonTranslationDto
                        {
                            LanguageCode = language.Code,
                            LanguageName = language.Name,
                            Title = fields[0],
                            Content = fields[1],
                            Summary = string.IsNullOrWhiteSpace(fields[2]) ? null : fields[2],
                            Examples = string.IsNullOrWhiteSpace(fields[3]) ? null : fields[3],
                            RevisionSummary = string.IsNullOrWhiteSpace(fields[4]) ? null : fields[4],
                            IsAutoTranslated = true
                        };
                    });

                var translatedLanguages = await Task.WhenAll(languageTasks);

                var allTranslations = new List<LessonTranslationDto>
            {
                // Source language entry
                new LessonTranslationDto
                {
                    LanguageCode = sourceLanguage.Code,
                    LanguageName = sourceLanguage.Name,
                    Title = rewrittenTitle,
                    Content = rewrittenContent,
                    Summary = input.Summary,
                    Examples = input.Examples,
                    RevisionSummary = input.RevisionSummary,
                    IsAutoTranslated = false
                }
            };
                allTranslations.AddRange(translatedLanguages);

                return (Difficulty: difficulty, LessonId: lessonId, Translations: allTranslations);
            });

            var generatedLessons = await Task.WhenAll(difficultyTasks);

            // -------------------------------------------------------
            // SAVE EVERYTHING TO DB
            // -------------------------------------------------------
            Guid? easyLessonId = null;
            Guid? mediumLessonId = null;
            Guid? hardLessonId = null;
            var allTranslationDtos = new List<LessonTranslationDto>();

            foreach (var (difficulty, lessonId, translationDtos) in generatedLessons)
            {
                var rewrittenTitle = $"{input.Title} ({difficulty})";

                var lesson = new Lesson(
                    lessonId,
                    topic.Id,
                    rewrittenTitle,
                    difficulty,
                    input.Summary,
                    input.LearningObjective,
                    input.RevisionSummary,
                    input.EstimatedMinutes,
                    input.IsPublished,
                    generatedByAI: false);

                await LessonRepository.InsertAsync(lesson);

                if (difficulty == DifficultyLevel.Easy) easyLessonId = lessonId;
                else if (difficulty == DifficultyLevel.Medium) mediumLessonId = lessonId;
                else if (difficulty == DifficultyLevel.Hard) hardLessonId = lessonId;

                foreach (var dto in translationDtos)
                {
                    var language = allLanguages.First(x => x.Code == dto.LanguageCode);

                    var translation = new LessonTranslation(
                        Guid.NewGuid(),
                        lessonId,
                        language.Id,
                        dto.Title,
                        dto.Content,
                        dto.Summary,
                        dto.Examples,
                        dto.RevisionSummary,
                        dto.IsAutoTranslated);

                    await LessonTranslationRepository.InsertAsync(translation);
                    allTranslationDtos.Add(dto);
                }
            }

            sourceMaterial.MarkCompleted(topic.Id, easyLessonId, mediumLessonId, hardLessonId);
            await CurrentUnitOfWork.SaveChangesAsync();

            return new UploadTextLearningMaterialOutput
            {
                SourceMaterialId = sourceMaterial.Id,
                SubjectId = subject.Id,
                TopicId = topic.Id,
                LessonId = mediumLessonId ?? easyLessonId ?? Guid.Empty,
                Title = input.Title,
                SourceLanguageCode = sourceLanguage.Code,
                Translations = allTranslationDtos
            };
        }
        catch (UserFriendlyException) { throw; }
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

    private static string BuildTextMaterialUrl(string title)
    {
        var slug = title.Trim().ToLowerInvariant().Replace(" ", "-");
        return $"text://materials/{slug}";
    }
}