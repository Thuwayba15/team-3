using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.LearningMaterials;
using Team3.Localization;
using Team3.Students.Dto;

namespace Team3.Students
{
    [AbpAuthorize]
    public class StudentDashboardAppService : Team3AppServiceBase, IStudentDashboardAppService
    {
        private static readonly TimeSpan DashboardCacheDuration = TimeSpan.FromSeconds(30);

        private readonly IRepository<Subject, Guid> _subjectRepository;
        private readonly IRepository<Topic, Guid> _topicRepository;
        private readonly IRepository<Lesson, Guid> _lessonRepository;
        private readonly IRepository<StudentEnrollment, Guid> _enrollmentRepository;
        private readonly IRepository<StudentAssessmentAttempt, Guid> _attemptRepository;
        private readonly IRepository<StudentLessonProgress, Guid> _lessonProgressRepository;
        private readonly IRepository<StudentTopicProgress, Guid> _topicProgressRepository;
        private readonly IRepository<StudentProgress, Guid> _studentProgressRepository;
        private readonly IRepository<Assessment, Guid> _assessmentRepository;
        private readonly IRepository<SubjectTranslation, Guid> _subjectTranslationRepository;
        private readonly IRepository<TopicTranslation, Guid> _topicTranslationRepository;
        private readonly IRepository<Language, Guid> _languageRepository;
        private readonly IRepository<UserLanguagePreference, long> _userLanguagePreferenceRepository;
        private readonly RecommendationEngine _recommendationEngine;
        private readonly IMemoryCache _memoryCache;

        public StudentDashboardAppService(
            IRepository<Subject, Guid> subjectRepository,
            IRepository<Topic, Guid> topicRepository,
            IRepository<Lesson, Guid> lessonRepository,
            IRepository<StudentEnrollment, Guid> enrollmentRepository,
            IRepository<StudentAssessmentAttempt, Guid> attemptRepository,
            IRepository<StudentLessonProgress, Guid> lessonProgressRepository,
            IRepository<StudentTopicProgress, Guid> topicProgressRepository,
            IRepository<StudentProgress, Guid> studentProgressRepository,
            IRepository<Assessment, Guid> assessmentRepository,
            IRepository<SubjectTranslation, Guid> subjectTranslationRepository,
            IRepository<TopicTranslation, Guid> topicTranslationRepository,
            IRepository<Language, Guid> languageRepository,
            IRepository<UserLanguagePreference, long> userLanguagePreferenceRepository,
            RecommendationEngine recommendationEngine,
            IMemoryCache memoryCache)
        {
            _subjectRepository = subjectRepository;
            _topicRepository = topicRepository;
            _lessonRepository = lessonRepository;
            _enrollmentRepository = enrollmentRepository;
            _attemptRepository = attemptRepository;
            _lessonProgressRepository = lessonProgressRepository;
            _topicProgressRepository = topicProgressRepository;
            _studentProgressRepository = studentProgressRepository;
            _assessmentRepository = assessmentRepository;
            _subjectTranslationRepository = subjectTranslationRepository;
            _topicTranslationRepository = topicTranslationRepository;
            _languageRepository = languageRepository;
            _userLanguagePreferenceRepository = userLanguagePreferenceRepository;
            _recommendationEngine = recommendationEngine;
            _memoryCache = memoryCache;
        }

        public async Task<StudentDashboardProgressDto> GetProgressAsync(Guid? subjectId)
        {
            var studentId = AbpSession.GetUserId();
            var preferredLanguageCode = await GetPreferredLanguageCodeAsync(studentId);
            var cacheKey = $"student-dashboard:{studentId}:{subjectId?.ToString() ?? "all"}:{preferredLanguageCode}";
            if (_memoryCache.TryGetValue(cacheKey, out StudentDashboardProgressDto? cachedDashboard) && cachedDashboard != null)
            {
                return cachedDashboard;
            }

            if (subjectId.HasValue)
            {
                await EnsureStudentHasAccessToSubjectAsync(studentId, subjectId.Value);
            }

            var enrolledSubjectIds = subjectId.HasValue
                ? new[] { subjectId.Value }.ToList()
                : await _enrollmentRepository.GetAll()
                    .Where(x => x.StudentId == studentId && x.IsActive)
                    .Select(x => x.SubjectId)
                    .ToListAsync();

            if (!enrolledSubjectIds.Any())
            {
                var emptyResult = new StudentDashboardProgressDto
                {
                    SubjectId = subjectId,
                    SubjectName = null,
                    OverallScore = 0m,
                    TopicsMastered = 0,
                    LessonsCompleted = 0,
                    QuizzesPassed = 0,
                    NeedsIntervention = false,
                    RecentQuizzes = new List<StudentDashboardRecentQuizDto>(),
                    CompletedLessons = new List<StudentDashboardCompletedLessonDto>(),
                    WeakTopics = new List<StudentDashboardWeakTopicDto>(),
                    TopicMasteries = new List<StudentDashboardTopicMasteryDto>(),
                    RecommendedLesson = null,
                    RevisionAdvices = new List<StudentDashboardRevisionAdviceDto>(),
                    MotivationalGuidance = GenerateMotivationalGuidance([])
                };
                _memoryCache.Set(cacheKey, emptyResult, DashboardCacheDuration);
                return emptyResult;
            }

            var languages = await GetRelevantLanguagesAsync(preferredLanguageCode);
            var languageCodeToId = languages
                .Where(x => !string.IsNullOrWhiteSpace(x.Code))
                .ToDictionary(x => x.Code.Trim().ToLowerInvariant(), x => x.Id);
            var languageIds = languages.Select(x => x.Id).ToList();
            var topics = await _topicRepository.GetAll()
                .AsNoTracking()
                .Where(x => enrolledSubjectIds.Contains(x.SubjectId) && x.IsActive)
                .ToListAsync();
            var topicIds = topics.Select(x => x.Id).ToList();
            var lessons = topicIds.Count == 0
                ? []
                : await _lessonRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => topicIds.Contains(x.TopicId))
                    .ToListAsync();
            var lessonIds = lessons.Select(x => x.Id).ToList();
            var subjects = await _subjectRepository.GetAll()
                .AsNoTracking()
                .Where(x => enrolledSubjectIds.Contains(x.Id))
                .ToListAsync();
            var topicById = topics.ToDictionary(x => x.Id);
            var lessonById = lessons.ToDictionary(x => x.Id);
            var subjectTranslations = await _subjectTranslationRepository.GetAll()
                .AsNoTracking()
                .Where(x => enrolledSubjectIds.Contains(x.SubjectId) && languageIds.Contains(x.LanguageId))
                .ToListAsync();
            var topicTranslations = topicIds.Count == 0
                ? []
                : await _topicTranslationRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => topicIds.Contains(x.TopicId) && languageIds.Contains(x.LanguageId))
                    .ToListAsync();
            var subjectNameById = BuildSubjectNameMap(subjects, subjectTranslations, languageCodeToId, preferredLanguageCode);
            var topicNameById = BuildTopicNameMap(topics, topicTranslations, languageCodeToId, preferredLanguageCode);

            var topicProgresses = topicIds.Count == 0
                ? []
                : await _topicProgressRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.StudentId == studentId && topicIds.Contains(x.TopicId))
                    .ToListAsync();
            var lessonProgresses = lessonIds.Count == 0
                ? []
                : await _lessonProgressRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => x.StudentId == studentId && lessonIds.Contains(x.LessonId))
                    .OrderByDescending(x => x.CompletedAt)
                    .ToListAsync();
            var attempts = await _attemptRepository.GetAll()
                .AsNoTracking()
                .Where(x => x.StudentId == studentId && enrolledSubjectIds.Contains(x.SubjectId) && x.AssessmentType == AssessmentType.Quiz)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
            var assessmentIds = attempts.Select(a => a.AssessmentId).Distinct().ToList();
            var assessments = assessmentIds.Count == 0
                ? []
                : await _assessmentRepository.GetAll()
                    .AsNoTracking()
                    .Where(x => assessmentIds.Contains(x.Id))
                    .ToListAsync();
            var assessmentById = assessments.ToDictionary(x => x.Id);
            var topicProgressByTopicId = topicProgresses
                .GroupBy(x => x.TopicId)
                .ToDictionary(group => group.Key, group => group.OrderByDescending(x => x.LastModificationTime ?? x.CreationTime).First());
            var lessonProgressByLessonId = lessonProgresses
                .GroupBy(x => x.LessonId)
                .ToDictionary(group => group.Key, group => group.OrderByDescending(x => x.LastModificationTime ?? x.CreationTime).First());
            var subjectProgressRecords = await _studentProgressRepository.GetAll()
                .AsNoTracking()
                .Where(x => x.StudentId == studentId && enrolledSubjectIds.Contains(x.SubjectId))
                .ToListAsync();
            var overallScore = topics.Count == 0
                ? 0m
                : Math.Round(
                    topics.Average(topic => topicProgressByTopicId.TryGetValue(topic.Id, out var progress) ? progress.MasteryScore : 0m),
                    2,
                    MidpointRounding.AwayFromZero);

            var result = new StudentDashboardProgressDto
            {
                SubjectId = subjectId,
                SubjectName = subjectId.HasValue && subjectNameById.TryGetValue(subjectId.Value, out var selectedSubjectName) ? selectedSubjectName : null,
                OverallScore = overallScore,
                TopicsMastered = topicProgresses.Count(x => x.Status == LearningProgressStatus.Completed),
                LessonsCompleted = lessonProgresses.Count(x => x.Status == LearningProgressStatus.Completed),
                QuizzesPassed = attempts.Count(x => x.Passed),
                NeedsIntervention = subjectProgressRecords.Any(x => x.NeedsIntervention),
                RecentQuizzes = attempts.Take(5).Select(attempt =>
                {
                    return new StudentDashboardRecentQuizDto
                    {
                        AttemptId = attempt.Id,
                        Title = assessmentById.TryGetValue(attempt.AssessmentId, out var assessment) ? assessment.Title : "Quiz",
                        TopicName = topicNameById.GetValueOrDefault(attempt.TopicId, topicById.TryGetValue(attempt.TopicId, out var topic) ? topic.Name : "Topic"),
                        Percentage = attempt.Percentage,
                        Passed = attempt.Passed,
                        SubmittedAt = attempt.SubmittedAt
                    };
                }).ToList(),
                CompletedLessons = lessonProgresses
                    .Where(x => x.Status == LearningProgressStatus.Completed)
                    .Take(5)
                    .Select(progress =>
                    {
                        return new StudentDashboardCompletedLessonDto
                        {
                            LessonId = progress.LessonId,
                            Title = lessonById.TryGetValue(progress.LessonId, out var lesson) ? lesson.Title : "Lesson",
                            TopicName = topicNameById.GetValueOrDefault(progress.TopicId, topicById.TryGetValue(progress.TopicId, out var topic) ? topic.Name : "Topic"),
                            CompletedAt = progress.CompletedAt
                        };
                    }).ToList(),
                WeakTopics = topicProgresses
                    .Where(x => x.NeedsRevision || x.MasteryScore < 50m)
                    .OrderBy(x => x.MasteryScore)
                    .Take(5)
                    .Select(progress =>
                    {
                        return new StudentDashboardWeakTopicDto
                        {
                            TopicId = progress.TopicId,
                            TopicName = topicNameById.GetValueOrDefault(progress.TopicId, topicById.TryGetValue(progress.TopicId, out var topic) ? topic.Name : "Topic"),
                            MasteryScore = progress.MasteryScore,
                            NeedsRevision = progress.NeedsRevision
                        };
                    }).ToList(),
                TopicMasteries = topics
                    .Select(topic =>
                    {
                        var subjectName = subjectNameById.TryGetValue(topic.SubjectId, out var name) ? name : "Subject";

                        return new StudentDashboardTopicMasteryDto
                        {
                            TopicId = topic.Id,
                            TopicName = topicNameById.GetValueOrDefault(topic.Id, topic.Name),
                            SubjectName = subjectName,
                            MasteryScore = topicProgressByTopicId.TryGetValue(topic.Id, out var progress) ? progress.MasteryScore : 0m
                        };
                    })
                    .OrderBy(x => x.SubjectName)
                    .ThenBy(x => x.TopicName)
                    .ToList(),
                RecommendedLesson = GenerateRecommendedLesson(enrolledSubjectIds, subjects, topics, lessons, topicProgressByTopicId, lessonProgressByLessonId, subjectNameById, topicNameById),
                RevisionAdvices = GenerateRevisionAdvices(topicProgresses, topics, topicNameById),
                MotivationalGuidance = GenerateMotivationalGuidance(subjectProgressRecords)
            };

            _memoryCache.Set(cacheKey, result, DashboardCacheDuration);
            return result;
        }

        private StudentDashboardRecommendationDto? GenerateRecommendedLesson(
            List<Guid> enrolledSubjectIds,
            List<Subject> subjects,
            List<Topic> topics,
            List<Lesson> lessons,
            IReadOnlyDictionary<Guid, StudentTopicProgress> latestTopicProgressByTopicId,
            IReadOnlyDictionary<Guid, StudentLessonProgress> latestLessonProgressByLessonId,
            IReadOnlyDictionary<Guid, string> subjectNameById,
            IReadOnlyDictionary<Guid, string> topicNameById)
        {
            if (!enrolledSubjectIds.Any() || !topics.Any() || !lessons.Any())
            {
                return null;
            }

            var subjectOrder = subjects
                .OrderBy(x => x.Name)
                .Select((subject, index) => new { subject.Id, Index = index })
                .ToDictionary(x => x.Id, x => x.Index);

            foreach (var subjectId in enrolledSubjectIds.OrderBy(id => subjectOrder.TryGetValue(id, out var index) ? index : int.MaxValue))
            {
                var subject = subjects.FirstOrDefault(x => x.Id == subjectId);
                var subjectTopics = topics
                    .Where(x => x.SubjectId == subjectId && x.IsActive)
                    .OrderBy(x => x.SequenceOrder)
                    .ToList();

                var firstUnlockedTopic = subjectTopics.FirstOrDefault(topic =>
                {
                    var progress = latestTopicProgressByTopicId.TryGetValue(topic.Id, out var latestProgress) ? latestProgress : null;
                    return progress?.Status != LearningProgressStatus.Completed;
                });

                if (firstUnlockedTopic == null)
                {
                    continue;
                }

                var assignedDifficulty = latestTopicProgressByTopicId.TryGetValue(firstUnlockedTopic.Id, out var topicProgress)
                    ? topicProgress.AssignedDifficultyLevel
                    : DifficultyLevel.Medium;

                var subjectLessons = ResolveTopicLessonsForDifficulty(lessons, firstUnlockedTopic.Id, assignedDifficulty);
                var nextLesson = subjectLessons.FirstOrDefault(lesson =>
                {
                    var progress = latestLessonProgressByLessonId.TryGetValue(lesson.Id, out var latestProgress) ? latestProgress : null;
                    return progress?.Status != LearningProgressStatus.Completed;
                }) ?? subjectLessons.FirstOrDefault();

                if (nextLesson == null)
                {
                    continue;
                }

                var progress = latestLessonProgressByLessonId.TryGetValue(nextLesson.Id, out var nextLessonProgress) ? nextLessonProgress : null;
                var actionState = progress?.Status == LearningProgressStatus.Completed ? "review" : "available";

                return new StudentDashboardRecommendationDto
                {
                    SubjectId = subject?.Id,
                    SubjectName = subject != null ? subjectNameById.GetValueOrDefault(subject.Id, subject.Name) : null,
                    LessonId = nextLesson.Id,
                    LessonTitle = nextLesson.Title,
                    TopicName = topicNameById.GetValueOrDefault(firstUnlockedTopic.Id, firstUnlockedTopic.Name),
                    EstimatedMinutes = nextLesson.EstimatedMinutes,
                    ActionState = actionState,
                    Reason = actionState == "review"
                        ? "Review this completed lesson to strengthen your understanding."
                        : "Recommended based on your current learning path."
                };
            }

            return null;
        }

        private List<StudentDashboardRevisionAdviceDto> GenerateRevisionAdvices(
            List<StudentTopicProgress> topicProgresses,
            List<Topic> topics,
            IReadOnlyDictionary<Guid, string> topicNameById)
        {
            var weaknessInsights = _recommendationEngine.RankWeakTopicsByTopicProgress(topics, topicProgresses, 3);
            return weaknessInsights
                .Select(insight =>
                {
                    var topic = topics.FirstOrDefault(x => x.Id == insight.TopicId);
                    var topicName = topic != null ? topicNameById.GetValueOrDefault(topic.Id, topic.Name) : null;
                    return new StudentDashboardRevisionAdviceDto
                    {
                        TopicName = topicName,
                        MasteryScore = insight.MasteryPercent,
                        Advice = $"Focus on revising {topicName ?? "this topic"} to improve your mastery."
                    };
                }).ToList();
        }

        private string? GenerateMotivationalGuidance(List<StudentProgress> subjectProgressRecords)
        {
            if (!subjectProgressRecords.Any())
                return "Start your learning journey today!";

            var avgScore = subjectProgressRecords.Average(x => x.MasteryScore);
            return avgScore switch
            {
                >= 80 => "Excellent progress! Keep up the momentum.",
                >= 60 => "Good work! A bit more effort will get you to mastery.",
                >= 40 => "You're making progress. Continue practicing to strengthen your skills.",
                _ => "Every expert started as a beginner. Don't give up!"
            };
        }

        private static List<Lesson> ResolveTopicLessonsForDifficulty(
            List<Lesson> lessons,
            Guid topicId,
            DifficultyLevel assignedDifficulty)
        {
            var selectedLessons = lessons
                .Where(x => x.TopicId == topicId && x.DifficultyLevel == assignedDifficulty)
                .OrderBy(x => x.Title)
                .ToList();

            if (selectedLessons.Count == 0)
            {
                selectedLessons = lessons
                    .Where(x => x.TopicId == topicId && x.DifficultyLevel == DifficultyLevel.Medium)
                    .OrderBy(x => x.Title)
                    .ToList();
            }

            if (selectedLessons.Count == 0)
            {
                selectedLessons = lessons
                    .Where(x => x.TopicId == topicId)
                    .OrderBy(x => x.Title)
                    .ToList();
            }

            return selectedLessons;
        }

        private async Task EnsureStudentHasAccessToSubjectAsync(long studentId, Guid subjectId)
        {
            var subject = await _subjectRepository.FirstOrDefaultAsync(subjectId) ?? throw new UserFriendlyException("Subject not found.");
            if (!subject.IsActive)
            {
                throw new UserFriendlyException("Subject is not active.");
            }

            var enrollment = await _enrollmentRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId && x.IsActive);
            if (enrollment == null)
            {
                throw new UserFriendlyException("You are not enrolled in this subject.");
            }
        }

        private async Task<string> GetPreferredLanguageCodeAsync(long userId)
        {
            var preference = await _userLanguagePreferenceRepository.GetAll()
                .AsNoTracking()
                .Where(x => x.UserId == userId)
                .Select(x => x.LanguageCode)
                .FirstOrDefaultAsync();

            if (!string.IsNullOrWhiteSpace(preference))
            {
                return preference.Trim().ToLowerInvariant();
            }

            var defaultLanguage = await _languageRepository.GetAll()
                .AsNoTracking()
                .Where(x => x.IsActive && !x.IsDeleted && x.IsDefault)
                .Select(x => x.Code)
                .FirstOrDefaultAsync();

            return defaultLanguage?.Trim().ToLowerInvariant() ?? "en";
        }

        private async Task<List<Language>> GetRelevantLanguagesAsync(string preferredLanguageCode)
        {
            return await _languageRepository.GetAll()
                .AsNoTracking()
                .Where(x => x.IsActive && !x.IsDeleted && (x.Code == preferredLanguageCode || x.Code == "en" || x.IsDefault))
                .ToListAsync();
        }

        private static Dictionary<Guid, string> BuildSubjectNameMap(
            IReadOnlyCollection<Subject> subjects,
            IReadOnlyCollection<SubjectTranslation> translations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var translationsBySubjectId = translations
                .GroupBy(x => x.SubjectId)
                .ToDictionary(group => group.Key, group => group.ToList());

            return subjects.ToDictionary(
                subject => subject.Id,
                subject => ResolveSubjectName(subject, translationsBySubjectId.GetValueOrDefault(subject.Id, []), languageCodeToId, preferredLanguageCode));
        }

        private static Dictionary<Guid, string> BuildTopicNameMap(
            IReadOnlyCollection<Topic> topics,
            IReadOnlyCollection<TopicTranslation> translations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var translationsByTopicId = translations
                .GroupBy(x => x.TopicId)
                .ToDictionary(group => group.Key, group => group.ToList());

            return topics.ToDictionary(
                topic => topic.Id,
                topic => ResolveTopicName(topic, translationsByTopicId.GetValueOrDefault(topic.Id, []), languageCodeToId, preferredLanguageCode));
        }

        private static string ResolveSubjectName(
            Subject subject,
            IReadOnlyCollection<SubjectTranslation> translations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var normalizedPreferredLanguageCode = preferredLanguageCode.Trim().ToLowerInvariant();
            if (languageCodeToId.TryGetValue(normalizedPreferredLanguageCode, out var preferredLanguageId))
            {
                var preferredTranslation = translations.FirstOrDefault(x => x.LanguageId == preferredLanguageId);
                if (!string.IsNullOrWhiteSpace(preferredTranslation?.Name))
                {
                    return preferredTranslation.Name;
                }
            }

            if (languageCodeToId.TryGetValue("en", out var englishLanguageId))
            {
                var englishTranslation = translations.FirstOrDefault(x => x.LanguageId == englishLanguageId);
                if (!string.IsNullOrWhiteSpace(englishTranslation?.Name))
                {
                    return englishTranslation.Name;
                }
            }

            return subject.Name;
        }

        private static string ResolveTopicName(
            Topic topic,
            IReadOnlyCollection<TopicTranslation> translations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var normalizedPreferredLanguageCode = preferredLanguageCode.Trim().ToLowerInvariant();
            if (languageCodeToId.TryGetValue(normalizedPreferredLanguageCode, out var preferredLanguageId))
            {
                var preferredTranslation = translations.FirstOrDefault(x => x.LanguageId == preferredLanguageId);
                if (!string.IsNullOrWhiteSpace(preferredTranslation?.Name))
                {
                    return preferredTranslation.Name;
                }
            }

            if (languageCodeToId.TryGetValue("en", out var englishLanguageId))
            {
                var englishTranslation = translations.FirstOrDefault(x => x.LanguageId == englishLanguageId);
                if (!string.IsNullOrWhiteSpace(englishTranslation?.Name))
                {
                    return englishTranslation.Name;
                }
            }

            return topic.Name;
        }
    }
}
