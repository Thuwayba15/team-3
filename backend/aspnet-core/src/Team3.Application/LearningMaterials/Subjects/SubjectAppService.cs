using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Application.Caching;
using Team3.Application.Localization;
using Team3.Configuration;
using Team3.LearningMaterials.Dto;
using Team3.Localization;

namespace Team3.LearningMaterials.Subjects
{
    [AbpAuthorize]
    public class StudentSubjectAppService : Team3AppServiceBase, IStudentSubjectAppService
    {
        private static readonly TimeSpan SubjectCacheDuration = TimeSpan.FromMinutes(2);

        public IRepository<Subject, Guid> SubjectRepository { get; set; }
        public IRepository<Topic, Guid> TopicRepository { get; set; }
        public IRepository<Lesson, Guid> LessonRepository { get; set; }
        public IRepository<LessonTranslation, Guid> LessonTranslationRepository { get; set; }
        public IRepository<StudentEnrollment, Guid> EnrollmentRepository { get; set; }
        public IRepository<StudentProgress, Guid> ProgressRepository { get; set; }
        public IRepository<Language, Guid> LanguageRepository { get; set; }
        public IRepository<UserLanguagePreference, long> UserLanguagePreferenceRepository { get; set; }
        public IRepository<SubjectTranslation, Guid> SubjectTranslationRepository { get; set; }
        public IRepository<TopicTranslation, Guid> TopicTranslationRepository { get; set; }

        private readonly ILanguageResolver _languageResolver;
        private readonly IMemoryCache _memoryCache;

        public StudentSubjectAppService(ILanguageResolver languageResolver, IMemoryCache memoryCache)
        {
            _languageResolver = languageResolver;
            _memoryCache = memoryCache;
        }

        public async Task<List<SubjectDto>> GetAllSubjectsAsync()
        {
            try
            {
                var userId = AbpSession.UserId ?? 0;
                var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(userId);
                var normalizedLanguageCode = NormalizeLanguageCode(languageCode);
                var cacheKey = $"student-subjects:all:{normalizedLanguageCode}";

                if (_memoryCache.TryGetValue(cacheKey, out List<SubjectDto>? cachedSubjects) && cachedSubjects != null)
                {
                    return cachedSubjects;
                }

                var languages = await GetRelevantLanguagesAsync(normalizedLanguageCode);
                var languageIds = languages.Select(x => x.Id).ToList();

                var subjects = await SubjectRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .OrderBy(x => x.Name)
                    .ToListAsync();
                var subjectIds = subjects.Select(x => x.Id).ToList();
                var translations = await SubjectTranslationRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => subjectIds.Contains(x.SubjectId) && languageIds.Contains(x.LanguageId))
                    .ToListAsync();

                var result = MapSubjects(
                    subjects,
                    normalizedLanguageCode,
                    translations,
                    languages);

                _memoryCache.Set(cacheKey, result, MemoryCacheEntryOptionsFactory.Create(SubjectCacheDuration));
                return result;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        public async Task<List<SubjectDto>> GetMySubjectsAsync()
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(studentId);
                var normalizedLanguageCode = NormalizeLanguageCode(languageCode);
                var cacheKey = $"student-subjects:mine:{studentId}:{normalizedLanguageCode}";

                if (_memoryCache.TryGetValue(cacheKey, out List<SubjectDto>? cachedSubjects) && cachedSubjects != null)
                {
                    return cachedSubjects;
                }

                var subjectIds = await EnrollmentRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.StudentId == studentId && x.IsActive)
                    .Select(x => x.SubjectId)
                    .Distinct()
                    .ToListAsync();

                if (subjectIds.Count == 0)
                {
                    return [];
                }

                var languages = await GetRelevantLanguagesAsync(normalizedLanguageCode);
                var languageIds = languages.Select(x => x.Id).ToList();
                var subjects = await SubjectRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => subjectIds.Contains(x.Id) && x.IsActive)
                    .OrderBy(x => x.Name)
                    .ToListAsync();
                var translations = await SubjectTranslationRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => subjectIds.Contains(x.SubjectId) && languageIds.Contains(x.LanguageId))
                    .ToListAsync();

                var result = MapSubjects(
                    subjects,
                    normalizedLanguageCode,
                    translations,
                    languages);

                _memoryCache.Set(cacheKey, result, MemoryCacheEntryOptionsFactory.Create(SubjectCacheDuration));
                return result;
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        public async Task<BulkEnrollOutput> BulkEnrollAsync(BulkEnrollInput input)
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var output = new BulkEnrollOutput();
                var subjectIds = input.SubjectIds
                    .Distinct()
                    .ToList();

                if (subjectIds.Count == 0)
                {
                    return output;
                }

                var existingSubjectIds = await SubjectRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => subjectIds.Contains(x.Id))
                    .Select(x => x.Id)
                    .ToListAsync();
                var existingSubjectIdSet = existingSubjectIds.ToHashSet();

                var existingEnrollments = await EnrollmentRepository.GetAll()
                    .Where(x => x.StudentId == studentId && subjectIds.Contains(x.SubjectId))
                    .ToListAsync();
                var enrollmentBySubjectId = existingEnrollments.ToDictionary(x => x.SubjectId);

                foreach (var subjectId in subjectIds)
                {
                    if (!existingSubjectIdSet.Contains(subjectId))
                    {
                        output.NotFoundSubjectIds.Add(subjectId);
                        continue;
                    }

                    if (enrollmentBySubjectId.TryGetValue(subjectId, out var existingEnrollment))
                    {
                        if (!existingEnrollment.IsActive)
                        {
                            existingEnrollment.Activate();
                        }

                        output.AlreadyEnrolledSubjectIds.Add(subjectId);
                        continue;
                    }

                    await EnrollmentRepository.InsertAsync(new StudentEnrollment(Guid.NewGuid(), studentId, subjectId));
                    await ProgressRepository.InsertAsync(new StudentProgress(Guid.NewGuid(), studentId, subjectId));
                    output.EnrolledSubjectIds.Add(subjectId);
                }

                await CurrentUnitOfWork.SaveChangesAsync();
                var languageCode = NormalizeLanguageCode(await _languageResolver.GetUserPreferredLanguageCodeAsync(studentId));
                _memoryCache.Remove($"student-subjects:mine:{studentId}:{languageCode}");
                return output;
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        public async Task<StudentProgressDto> GetSubjectProgressAsync(Guid subjectId)
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var subject = await SubjectRepository.FirstOrDefaultAsync(subjectId)
                    ?? throw new UserFriendlyException("Subject not found.");

                var progress = await ProgressRepository.FirstOrDefaultAsync(
                    x => x.StudentId == studentId && x.SubjectId == subjectId);

                if (progress == null)
                {
                    throw new UserFriendlyException("No progress record found. Please enroll in this subject first.");
                }

                return new StudentProgressDto
                {
                    Id = progress.Id,
                    StudentId = progress.StudentId,
                    SubjectId = progress.SubjectId,
                    SubjectName = subject.Name,
                    MasteryScore = progress.MasteryScore,
                    ProgressStatus = progress.ProgressStatus,
                    LastAssessmentScore = progress.LastAssessmentScore,
                    AttemptCount = progress.AttemptCount,
                    NeedsIntervention = progress.NeedsIntervention,
                    UpdatedAt = progress.UpdatedAt,
                    CompletedLessonCount = progress.CompletedLessonCount,
                    RevisionNeeded = progress.RevisionNeeded,
                };
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        public async Task<List<TopicDto>> GetTopicsBySubjectAsync(Guid subjectId)
        {
            try
            {
                var subjectExists = await SubjectRepository.GetAll()
                    .AsNoTracking()
                    .AnyAsync(x => x.Id == subjectId);

                if (!subjectExists)
                {
                    throw new UserFriendlyException("Subject not found.");
                }

                var userId = AbpSession.UserId ?? 0;
                var languageCode = await _languageResolver.GetUserPreferredLanguageCodeAsync(userId);
                var normalizedLanguageCode = NormalizeLanguageCode(languageCode);
                var cacheKey = $"student-subjects:topics:{subjectId}:{normalizedLanguageCode}";

                if (_memoryCache.TryGetValue(cacheKey, out List<TopicDto>? cachedTopics) && cachedTopics != null)
                {
                    return cachedTopics;
                }

                var languages = await GetRelevantLanguagesAsync(normalizedLanguageCode);
                var languageIds = languages.Select(x => x.Id).ToList();

                var topics = await TopicRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.SubjectId == subjectId && x.IsActive)
                    .OrderBy(x => x.SequenceOrder)
                    .ToListAsync();
                var translations = await TopicTranslationRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.Topic.SubjectId == subjectId && languageIds.Contains(x.LanguageId))
                    .ToListAsync();

                var result = MapTopics(
                    topics,
                    normalizedLanguageCode,
                    translations,
                    languages);

                _memoryCache.Set(cacheKey, result, MemoryCacheEntryOptionsFactory.Create(SubjectCacheDuration));
                return result;
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        public async Task<List<LessonSummaryDto>> GetLessonsByTopicAsync(Guid topicId)
        {
            try
            {
                var topicExists = await TopicRepository.GetAll()
                    .AsNoTracking()
                    .AnyAsync(x => x.Id == topicId);

                if (!topicExists)
                {
                    throw new UserFriendlyException("Topic not found.");
                }

                var lessons = await LessonRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.TopicId == topicId)
                    .OrderBy(x => x.Title)
                    .ToListAsync();

                return lessons.Select(lesson => new LessonSummaryDto
                {
                    Id = lesson.Id,
                    TopicId = lesson.TopicId,
                    Title = lesson.Title,
                    DifficultyLevel = lesson.DifficultyLevel,
                    EstimatedMinutes = lesson.EstimatedMinutes,
                    IsPublished = lesson.IsPublished,
                }).ToList();
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        public async Task<LessonDetailDto> GetLessonAsync(Guid lessonId)
        {
            try
            {
                var studentId = AbpSession.UserId
                    ?? throw new UserFriendlyException("You must be logged in.");

                var lesson = await LessonRepository.FirstOrDefaultAsync(lessonId)
                    ?? throw new UserFriendlyException("Lesson not found.");
                var topic = await TopicRepository.FirstOrDefaultAsync(lesson.TopicId)
                    ?? throw new UserFriendlyException("Topic not found.");

                var hasEnrollment = await EnrollmentRepository.GetAll()
                    .AsNoTracking()
                    .AnyAsync(x => x.StudentId == studentId && x.SubjectId == topic.SubjectId && x.IsActive);

                if (!hasEnrollment)
                {
                    throw new UserFriendlyException("You are not enrolled in this subject.");
                }

                var preferredLanguageCode = await GetPreferredLanguageCodeAsync(studentId);
                var translations = await LessonTranslationRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.LessonId == lessonId)
                    .ToListAsync();
                var languages = await LanguageRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.IsActive)
                    .ToListAsync();

                var languageMap = languages.ToDictionary(x => x.Id);
                var orderedTranslations = translations
                    .OrderByDescending(translation =>
                        languageMap.TryGetValue(translation.LanguageId, out var language)
                        && string.Equals(language.Code, preferredLanguageCode, StringComparison.OrdinalIgnoreCase))
                    .ThenByDescending(translation =>
                        languageMap.TryGetValue(translation.LanguageId, out var language)
                        && string.Equals(language.Code, "en", StringComparison.OrdinalIgnoreCase))
                    .ThenBy(translation =>
                        languageMap.TryGetValue(translation.LanguageId, out var language) ? language.Name : "Unknown")
                    .ToList();

                var selectedTranslation = orderedTranslations.FirstOrDefault(translation =>
                        languageMap.TryGetValue(translation.LanguageId, out var language)
                        && string.Equals(language.Code, preferredLanguageCode, StringComparison.OrdinalIgnoreCase))
                    ?? orderedTranslations.FirstOrDefault(translation =>
                        languageMap.TryGetValue(translation.LanguageId, out var language)
                        && string.Equals(language.Code, "en", StringComparison.OrdinalIgnoreCase))
                    ?? orderedTranslations.FirstOrDefault();

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
                    PreferredLanguageCode = preferredLanguageCode,
                    SelectedTranslation = selectedTranslation == null ? null : MapLessonTranslationSummary(selectedTranslation, languageMap),
                    Translations = orderedTranslations
                        .Select(translation => MapLessonTranslationSummary(translation, languageMap))
                        .ToList(),
                };
            }
            catch (UserFriendlyException)
            {
                throw;
            }
            catch (Exception ex)
            {
                throw new UserFriendlyException($"DEBUG: {ex.GetType().Name}: {ex.Message}");
            }
        }

        private async Task<string> GetPreferredLanguageCodeAsync(long userId)
        {
            var preference = await UserLanguagePreferenceRepository.FirstOrDefaultAsync(x => x.UserId == userId);
            if (preference != null && !string.IsNullOrWhiteSpace(preference.LanguageCode))
            {
                return preference.LanguageCode.Trim().ToLowerInvariant();
            }

            var defaultLanguage = await LanguageRepository.FirstOrDefaultAsync(x => x.IsDefault && x.IsActive);
            return defaultLanguage?.Code?.Trim().ToLowerInvariant() ?? "en";
        }

        private async Task<List<Language>> GetRelevantLanguagesAsync(string preferredLanguageCode)
        {
            return await LanguageRepository.GetAll()
                .AsNoTracking()
                .Where(x => x.IsActive && (x.Code == preferredLanguageCode || x.Code == "en" || x.IsDefault))
                .ToListAsync();
        }

        private static string NormalizeLanguageCode(string languageCode)
        {
            return string.IsNullOrWhiteSpace(languageCode)
                ? "en"
                : languageCode.Trim().ToLowerInvariant();
        }

        private static List<SubjectDto> MapSubjects(
            IReadOnlyCollection<Subject> subjects,
            string languageCode,
            IReadOnlyCollection<SubjectTranslation> translations,
            IReadOnlyCollection<Language> languages)
        {
            var languageCodeToId = languages.ToDictionary(language => language.Code, language => language.Id, StringComparer.OrdinalIgnoreCase);
            var translationsBySubjectId = translations
                .GroupBy(translation => translation.SubjectId)
                .ToDictionary(
                    group => group.Key,
                    group => group.ToDictionary(translation => translation.LanguageId, translation => translation));

            languageCodeToId.TryGetValue(languageCode, out var preferredLanguageId);
            languageCodeToId.TryGetValue("en", out var englishLanguageId);

            return subjects.Select(subject =>
            {
                translationsBySubjectId.TryGetValue(subject.Id, out var subjectTranslations);
                SubjectTranslation? translation = null;

                if (subjectTranslations != null && preferredLanguageId != Guid.Empty)
                {
                    subjectTranslations.TryGetValue(preferredLanguageId, out translation);
                }

                if (translation == null && englishLanguageId != Guid.Empty)
                {
                    subjectTranslations?.TryGetValue(englishLanguageId, out translation);
                }

                return new SubjectDto
                {
                    Id = subject.Id,
                    Name = translation?.Name ?? subject.Name,
                    Description = translation?.Description ?? subject.Description,
                    GradeLevel = subject.GradeLevel,
                    IsActive = subject.IsActive,
                };
            }).ToList();
        }

        private static List<TopicDto> MapTopics(
            IReadOnlyCollection<Topic> topics,
            string languageCode,
            IReadOnlyCollection<TopicTranslation> translations,
            IReadOnlyCollection<Language> languages)
        {
            var languageCodeToId = languages.ToDictionary(language => language.Code, language => language.Id, StringComparer.OrdinalIgnoreCase);
            var translationsByTopicId = translations
                .GroupBy(translation => translation.TopicId)
                .ToDictionary(
                    group => group.Key,
                    group => group.ToDictionary(translation => translation.LanguageId, translation => translation));

            languageCodeToId.TryGetValue(languageCode, out var preferredLanguageId);
            languageCodeToId.TryGetValue("en", out var englishLanguageId);

            return topics.Select(topic =>
            {
                translationsByTopicId.TryGetValue(topic.Id, out var topicTranslations);
                TopicTranslation? translation = null;

                if (topicTranslations != null && preferredLanguageId != Guid.Empty)
                {
                    topicTranslations.TryGetValue(preferredLanguageId, out translation);
                }

                if (translation == null && englishLanguageId != Guid.Empty)
                {
                    topicTranslations?.TryGetValue(englishLanguageId, out translation);
                }

                return new TopicDto
                {
                    Id = topic.Id,
                    SubjectId = topic.SubjectId,
                    Name = translation?.Name ?? topic.Name,
                    Description = translation?.Description ?? topic.Description,
                    DifficultyLevel = topic.DifficultyLevel,
                    SequenceOrder = topic.SequenceOrder,
                    IsActive = topic.IsActive,
                };
            }).ToList();
        }

        private static LessonTranslationSummaryDto MapLessonTranslationSummary(
            LessonTranslation translation,
            IReadOnlyDictionary<Guid, Language> languageMap)
        {
            return new LessonTranslationSummaryDto
            {
                LanguageCode = languageMap.TryGetValue(translation.LanguageId, out var language)
                    ? language.Code
                    : translation.LanguageId.ToString(),
                LanguageName = languageMap.TryGetValue(translation.LanguageId, out var languageInfo)
                    ? languageInfo.Name
                    : "Unknown",
                Title = translation.Title,
                Content = translation.Content,
                Summary = translation.Summary,
                Examples = translation.Examples,
                RevisionSummary = translation.RevisionSummary,
                IsAutoTranslated = translation.IsAutoTranslated,
            };
        }
    }
}
