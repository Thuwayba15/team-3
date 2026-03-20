using Abp.Authorization;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Team3.Academic;
using Team3.Configuration;
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.Localization;
using Team3.Students.Dto;

namespace Team3.Students
{
    [AbpAuthorize]
    public class StudentLearningPathAppService : Team3AppServiceBase, IStudentLearningPathAppService
    {
        private readonly IRepository<Subject, Guid> _subjectRepository;
        private readonly IRepository<Topic, Guid> _topicRepository;
        private readonly IRepository<Lesson, Guid> _lessonRepository;
        private readonly IRepository<LessonTranslation, Guid> _lessonTranslationRepository;
        private readonly IRepository<Assessment, Guid> _assessmentRepository;
        private readonly IRepository<StudentEnrollment, Guid> _enrollmentRepository;
        private readonly IRepository<StudentTopicProgress, Guid> _topicProgressRepository;
        private readonly IRepository<StudentLessonProgress, Guid> _lessonProgressRepository;
        private readonly IRepository<StudentProgress, Guid> _studentProgressRepository;
        private readonly IRepository<StudentAssessmentAttempt, Guid> _attemptRepository;
        private readonly IRepository<Language, Guid> _languageRepository;
        private readonly IRepository<UserLanguagePreference, long> _userLanguagePreferenceRepository;
        private readonly IRepository<SubjectTranslation, Guid> _subjectTranslationRepository;
        private readonly IRepository<TopicTranslation, Guid> _topicTranslationRepository;

        public StudentLearningPathAppService(
            IRepository<Subject, Guid> subjectRepository,
            IRepository<Topic, Guid> topicRepository,
            IRepository<Lesson, Guid> lessonRepository,
            IRepository<LessonTranslation, Guid> lessonTranslationRepository,
            IRepository<Assessment, Guid> assessmentRepository,
            IRepository<StudentEnrollment, Guid> enrollmentRepository,
            IRepository<StudentTopicProgress, Guid> topicProgressRepository,
            IRepository<StudentLessonProgress, Guid> lessonProgressRepository,
            IRepository<StudentProgress, Guid> studentProgressRepository,
            IRepository<StudentAssessmentAttempt, Guid> attemptRepository,
            IRepository<Language, Guid> languageRepository,
            IRepository<UserLanguagePreference, long> userLanguagePreferenceRepository,
            IRepository<SubjectTranslation, Guid> subjectTranslationRepository,
            IRepository<TopicTranslation, Guid> topicTranslationRepository)
        {
            _subjectRepository = subjectRepository;
            _topicRepository = topicRepository;
            _lessonRepository = lessonRepository;
            _lessonTranslationRepository = lessonTranslationRepository;
            _assessmentRepository = assessmentRepository;
            _enrollmentRepository = enrollmentRepository;
            _topicProgressRepository = topicProgressRepository;
            _lessonProgressRepository = lessonProgressRepository;
            _studentProgressRepository = studentProgressRepository;
            _attemptRepository = attemptRepository;
            _languageRepository = languageRepository;
            _userLanguagePreferenceRepository = userLanguagePreferenceRepository;
            _subjectTranslationRepository = subjectTranslationRepository;
            _topicTranslationRepository = topicTranslationRepository;
        }

        public async Task<StudentLearningPathDto> GetSubjectPathAsync(Guid subjectId)
        {
            var studentId = AbpSession.GetUserId();
            var subject = await _subjectRepository.FirstOrDefaultAsync(subjectId)
                ?? throw new UserFriendlyException("Subject not found.");
            await EnsureStudentHasAccessToSubjectAsync(studentId, subjectId);

            var preferredLanguageCode = await GetPreferredLanguageCodeAsync(studentId);
            var languages = await _languageRepository.GetAllListAsync();
            var languageMap = languages.ToDictionary(x => x.Id);
            var languageCodeToId = languages
                .Where(x => !string.IsNullOrWhiteSpace(x.Code))
                .GroupBy(x => x.Code.Trim().ToLowerInvariant())
                .ToDictionary(group => group.Key, group => group.First().Id);
            var topics = await _topicRepository.GetAll()
                .Where(x => x.SubjectId == subjectId && x.IsActive)
                .OrderBy(x => x.SequenceOrder)
                .ToListAsync();

            var topicIds = topics.Select(x => x.Id).ToList();
            var subjectTranslations = await _subjectTranslationRepository.GetAll()
                .Where(x => x.SubjectId == subjectId)
                .ToListAsync();
            var topicTranslations = await _topicTranslationRepository.GetAll()
                .Where(x => topicIds.Contains(x.TopicId))
                .ToListAsync();
            var translatedSubjectName = ResolveTranslatedSubjectName(subject, subjectTranslations, languageCodeToId, preferredLanguageCode);

            var topicProgresses = await _topicProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && topicIds.Contains(x.TopicId))
                .ToListAsync();

            var lessons = await _lessonRepository.GetAll()
                .Where(x => topicIds.Contains(x.TopicId))
                .OrderBy(x => x.Title)
                .ToListAsync();

            var lessonIds = lessons.Select(x => x.Id).ToList();
            var lessonTranslations = await _lessonTranslationRepository.GetAll()
                .Where(x => lessonIds.Contains(x.LessonId))
                .ToListAsync();

            var lessonProgresses = await _lessonProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && lessonIds.Contains(x.LessonId))
                .ToListAsync();

            var assessments = await _assessmentRepository.GetAll()
                .Where(x => topicIds.Contains(x.TopicId))
                .ToListAsync();

            var subjectProgress = await _studentProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);
            var firstUnlockedTopicId = topics
                .FirstOrDefault(topic => topicProgresses.FirstOrDefault(progress => progress.TopicId == topic.Id)?.Status != LearningProgressStatus.Completed)
                ?.Id;

            var topicDtos = new List<StudentLearningPathTopicDto>();

            foreach (var topic in topics)
            {
                var topicProgress = topicProgresses.FirstOrDefault(x => x.TopicId == topic.Id);
                var diagnosticAssessment = assessments
                    .Where(x => x.TopicId == topic.Id && x.AssessmentType == AssessmentType.Diagnostic)
                    .OrderBy(x => x.Title)
                    .FirstOrDefault();

                var topicStatus = topicProgress?.Status == LearningProgressStatus.Completed
                    ? "completed"
                    : topic.Id == firstUnlockedTopicId
                        ? "current"
                        : "locked";

                DifficultyLevel? assignedDifficulty = topicProgress?.AssignedDifficultyLevel;
                if (assignedDifficulty == null && diagnosticAssessment == null)
                {
                    assignedDifficulty = DifficultyLevel.Medium;
                }

                var topicLessons = BuildTopicLessons(
                    topic,
                    topicStatus,
                    assignedDifficulty,
                    lessons,
                    lessonTranslations,
                    lessonProgresses,
                    assessments,
                    languageMap,
                    preferredLanguageCode,
                    topicProgress?.Status == LearningProgressStatus.Completed);

                var allLessonsCompleted = topicLessons.Count > 0 && topicLessons.All(x => x.Status == "completed");
                var anyQuizAvailable = topicLessons.Any(x => x.QuizAssessmentId.HasValue);
                var recommendedAction = topicStatus == "locked"
                    ? "Complete the previous topic to unlock this one."
                    : assignedDifficulty == null
                        ? "Take the diagnostic assessment to unlock this topic."
                        : topicLessons.Count == 0
                            ? "No lesson is available for the assigned difficulty yet."
                            : allLessonsCompleted
                                ? anyQuizAvailable
                                    ? "Take the lesson quiz to complete this topic."
                                    : "A lesson quiz is not available for this topic yet."
                                : "Continue with your current lesson.";

                topicDtos.Add(new StudentLearningPathTopicDto
                {
                    TopicId = topic.Id,
                    Name = ResolveTranslatedTopicName(topic, topicTranslations, languageCodeToId, preferredLanguageCode),
                    Description = topic.Description,
                    Status = topicStatus,
                    AssignedDifficultyLevel = assignedDifficulty,
                    MasteryScore = topicProgress?.MasteryScore ?? 0m,
                    NeedsRevision = topicProgress?.NeedsRevision ?? false,
                    DiagnosticAssessmentId = diagnosticAssessment?.Id,
                    RecommendedAction = recommendedAction,
                    Lessons = topicLessons
                });
            }

            var overallProgressPercent = subjectProgress?.MasteryScore
                ?? (topicDtos.Count == 0 ? 0m : Math.Round(topicDtos.Count(x => x.Status == "completed") * 100m / topicDtos.Count, 2, MidpointRounding.AwayFromZero));

            var currentTopic = topicDtos.FirstOrDefault(x => x.Status == "current");
            var rootAction = currentTopic?.RecommendedAction
                ?? (topicDtos.All(x => x.Status == "completed")
                    ? "You have completed the available learning path for this subject."
                    : "Start with the first available topic.");

            return new StudentLearningPathDto
            {
                SubjectId = subject.Id,
                SubjectName = translatedSubjectName,
                GradeLevel = subject.GradeLevel,
                OverallProgressPercent = overallProgressPercent,
                RecommendedAction = rootAction,
                Topics = topicDtos
            };
        }

        public async Task<CompleteLessonOutputDto> CompleteLessonAsync(CompleteLessonInputDto input)
        {
            if (input == null)
            {
                throw new UserFriendlyException("Lesson completion input is required.");
            }

            var studentId = AbpSession.GetUserId();
            var lesson = await _lessonRepository.FirstOrDefaultAsync(input.LessonId)
                ?? throw new UserFriendlyException("Lesson not found.");
            var topic = await _topicRepository.FirstOrDefaultAsync(lesson.TopicId)
                ?? throw new UserFriendlyException("Topic not found.");
            var subject = await _subjectRepository.FirstOrDefaultAsync(topic.SubjectId)
                ?? throw new UserFriendlyException("Subject not found.");

            await EnsureStudentHasAccessToSubjectAsync(studentId, subject.Id);

            var topicProgress = await _topicProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.TopicId == topic.Id);
            if (topicProgress == null)
            {
                topicProgress = new StudentTopicProgress(Guid.NewGuid(), studentId, topic.Id, lesson.DifficultyLevel);
                await _topicProgressRepository.InsertAsync(topicProgress);
            }

            if (topicProgress.Status == LearningProgressStatus.Completed)
            {
                return new CompleteLessonOutputDto
                {
                    LessonId = lesson.Id,
                    Status = "completed",
                    ActionState = "review",
                    NextRecommendedAction = "This lesson has already been completed. You can review it any time.",
                    SubjectId = subject.Id,
                    TopicId = topic.Id
                };
            }

            if (topicProgress.Status != LearningProgressStatus.Current)
            {
                topicProgress.MarkCurrent(topicProgress.AssignedDifficultyLevel, topicProgress.MasteryScore, topicProgress.NeedsRevision);
            }

            var lessonProgress = await _lessonProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.LessonId == lesson.Id);
            if (lessonProgress == null)
            {
                lessonProgress = new StudentLessonProgress(Guid.NewGuid(), studentId, lesson.Id, subject.Id, topic.Id);
                await _lessonProgressRepository.InsertAsync(lessonProgress);
            }

            if (lessonProgress.Status == LearningProgressStatus.Completed)
            {
                return new CompleteLessonOutputDto
                {
                    LessonId = lesson.Id,
                    Status = "completed",
                    ActionState = "review",
                    NextRecommendedAction = "This lesson has already been completed. You can review it any time.",
                    SubjectId = subject.Id,
                    TopicId = topic.Id
                };
            }

            lessonProgress.MarkCurrent();

            var quizAssessment = await ResolveLessonQuizAsync(lesson.Id, topic.Id, topicProgress.AssignedDifficultyLevel);

            await UpdateStudentProgressAsync(studentId, subject.Id);
            await CurrentUnitOfWork.SaveChangesAsync();

            return new CompleteLessonOutputDto
            {
                LessonId = lesson.Id,
                Status = "current",
                ActionState = "available",
                NextRecommendedAction = quizAssessment != null
                    ? "Take the lesson quiz to complete this topic."
                    : "No lesson quiz is available for this lesson yet.",
                SubjectId = subject.Id,
                TopicId = topic.Id
            };
        }

        private List<StudentLearningPathLessonDto> BuildTopicLessons(
            Topic topic,
            string topicStatus,
            DifficultyLevel? assignedDifficulty,
            IReadOnlyCollection<Lesson> lessons,
            IReadOnlyCollection<LessonTranslation> lessonTranslations,
            IReadOnlyCollection<StudentLessonProgress> lessonProgresses,
            IReadOnlyCollection<Assessment> assessments,
            IReadOnlyDictionary<Guid, Language> languageMap,
            string preferredLanguageCode,
            bool topicCompleted)
        {
            if (assignedDifficulty == null)
            {
                return new List<StudentLearningPathLessonDto>();
            }

            var selectedLessons = lessons.Where(x => x.TopicId == topic.Id && x.DifficultyLevel == assignedDifficulty.Value).OrderBy(x => x.Title).ToList();
            if (selectedLessons.Count == 0)
            {
                selectedLessons = lessons.Where(x => x.TopicId == topic.Id && x.DifficultyLevel == DifficultyLevel.Medium).OrderBy(x => x.Title).ToList();
            }

            if (selectedLessons.Count == 0)
            {
                selectedLessons = lessons.Where(x => x.TopicId == topic.Id).OrderBy(x => x.Title).ToList();
            }

            var firstIncompleteLessonId = selectedLessons
                .FirstOrDefault(lesson => lessonProgresses.FirstOrDefault(progress => progress.LessonId == lesson.Id)?.Status != LearningProgressStatus.Completed)
                ?.Id;

            return selectedLessons.Select(lesson =>
            {
                var progress = lessonProgresses.FirstOrDefault(x => x.LessonId == lesson.Id);
                var status = topicStatus == "locked"
                    ? "locked"
                    : topicCompleted || progress?.Status == LearningProgressStatus.Completed
                        ? "completed"
                        : lesson.Id == firstIncompleteLessonId
                            ? "current"
                            : "locked";

                var translation = SelectBestLessonTranslation(lessonTranslations.Where(x => x.LessonId == lesson.Id).ToList(), languageMap, preferredLanguageCode);
                var quizAssessment = ResolveLessonQuiz(assessments, lesson.Id, topic.Id, assignedDifficulty.Value);
                var actionState = status switch
                {
                    "completed" => "review",
                    "current" => "available",
                    _ => "locked"
                };

                return new StudentLearningPathLessonDto
                {
                    LessonId = lesson.Id,
                    Title = translation?.Title ?? lesson.Title,
                    DifficultyLevel = lesson.DifficultyLevel,
                    EstimatedMinutes = lesson.EstimatedMinutes,
                    Status = status,
                    ActionState = actionState,
                    CanComplete = status == "current",
                    QuizAssessmentId = quizAssessment?.Id,
                    QuizStatus = quizAssessment != null ? "available" : "unavailable",
                    QuizUnavailableReason = quizAssessment == null ? "No lesson quiz is available for this lesson yet." : null
                };
            }).ToList();
        }

        private async Task EnsureStudentHasAccessToSubjectAsync(long studentId, Guid subjectId)
        {
            var enrollment = await _enrollmentRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId && x.IsActive);
            if (enrollment == null)
            {
                throw new UserFriendlyException("You are not enrolled in this subject.");
            }
        }

        private async Task<string> GetPreferredLanguageCodeAsync(long userId)
        {
            var preference = await _userLanguagePreferenceRepository.FirstOrDefaultAsync(x => x.UserId == userId);
            if (preference != null && !string.IsNullOrWhiteSpace(preference.LanguageCode))
            {
                return preference.LanguageCode.Trim().ToLowerInvariant();
            }

            var defaultLanguage = await _languageRepository.FirstOrDefaultAsync(x => x.IsDefault && x.IsActive);
            return defaultLanguage?.Code?.Trim().ToLowerInvariant() ?? "en";
        }

        private static LessonTranslation? SelectBestLessonTranslation(IReadOnlyCollection<LessonTranslation> translations, IReadOnlyDictionary<Guid, Language> languageMap, string preferredLanguageCode)
        {
            return translations.FirstOrDefault(x => languageMap.TryGetValue(x.LanguageId, out var language) && string.Equals(language.Code, preferredLanguageCode, StringComparison.OrdinalIgnoreCase))
                   ?? translations.FirstOrDefault(x => languageMap.TryGetValue(x.LanguageId, out var language) && string.Equals(language.Code, "en", StringComparison.OrdinalIgnoreCase))
                   ?? translations.FirstOrDefault();
        }

        private static string ResolveTranslatedSubjectName(
            Subject subject,
            IReadOnlyCollection<SubjectTranslation> subjectTranslations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var translation = SelectBestSubjectTranslation(subjectTranslations, languageCodeToId, preferredLanguageCode);
            return translation?.Name ?? subject.Name;
        }

        private static SubjectTranslation? SelectBestSubjectTranslation(
            IReadOnlyCollection<SubjectTranslation> subjectTranslations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var normalizedPreferredLanguageCode = preferredLanguageCode.Trim().ToLowerInvariant();
            if (languageCodeToId.TryGetValue(normalizedPreferredLanguageCode, out var preferredLanguageId))
            {
                var preferredTranslation = subjectTranslations.FirstOrDefault(x => x.LanguageId == preferredLanguageId);
                if (preferredTranslation != null)
                {
                    return preferredTranslation;
                }
            }

            if (languageCodeToId.TryGetValue("en", out var englishLanguageId))
            {
                return subjectTranslations.FirstOrDefault(x => x.LanguageId == englishLanguageId);
            }

            return subjectTranslations.FirstOrDefault();
        }

        private static string ResolveTranslatedTopicName(
            Topic topic,
            IReadOnlyCollection<TopicTranslation> topicTranslations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var translation = SelectBestTopicTranslation(topicTranslations.Where(x => x.TopicId == topic.Id).ToList(), languageCodeToId, preferredLanguageCode);
            return translation?.Name ?? topic.Name;
        }

        private static TopicTranslation? SelectBestTopicTranslation(
            IReadOnlyCollection<TopicTranslation> topicTranslations,
            IReadOnlyDictionary<string, Guid> languageCodeToId,
            string preferredLanguageCode)
        {
            var normalizedPreferredLanguageCode = preferredLanguageCode.Trim().ToLowerInvariant();
            if (languageCodeToId.TryGetValue(normalizedPreferredLanguageCode, out var preferredLanguageId))
            {
                var preferredTranslation = topicTranslations.FirstOrDefault(x => x.LanguageId == preferredLanguageId);
                if (preferredTranslation != null)
                {
                    return preferredTranslation;
                }
            }

            if (languageCodeToId.TryGetValue("en", out var englishLanguageId))
            {
                return topicTranslations.FirstOrDefault(x => x.LanguageId == englishLanguageId);
            }

            return topicTranslations.FirstOrDefault();
        }

        private async Task<Assessment?> ResolveLessonQuizAsync(Guid lessonId, Guid topicId, DifficultyLevel assignedDifficulty)
        {
            var assessments = await _assessmentRepository.GetAll()
                .Where(x => x.AssessmentType == AssessmentType.Quiz && x.TopicId == topicId && x.LessonId == lessonId)
                .ToListAsync();

            return ResolveLessonQuiz(assessments, lessonId, topicId, assignedDifficulty);
        }

        private static Assessment? ResolveLessonQuiz(IEnumerable<Assessment> assessments, Guid lessonId, Guid topicId, DifficultyLevel assignedDifficulty)
        {
            var candidates = assessments
                .Where(x => x.AssessmentType == AssessmentType.Quiz && x.TopicId == topicId && x.LessonId == lessonId)
                .OrderBy(x => x.Title)
                .ToList();

            return candidates.FirstOrDefault(x => x.DifficultyLevel == assignedDifficulty)
                   ?? candidates.FirstOrDefault(x => x.DifficultyLevel == DifficultyLevel.Medium)
                   ?? candidates.FirstOrDefault();
        }

        private async Task UpdateStudentProgressAsync(long studentId, Guid subjectId)
        {
            var attempts = await _attemptRepository.GetAll()
                .Where(x => x.StudentId == studentId && x.SubjectId == subjectId)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();

            var topicIds = await _topicRepository.GetAll()
                .Where(x => x.SubjectId == subjectId && x.IsActive)
                .Select(x => x.Id)
                .ToListAsync();

            var topicProgresses = await _topicProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && topicIds.Contains(x.TopicId))
                .ToListAsync();

            var lessonProgresses = await _lessonProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && x.SubjectId == subjectId)
                .ToListAsync();

            var masteryScore = attempts.Any() ? Math.Round(attempts.Average(x => x.Percentage), 2, MidpointRounding.AwayFromZero) : 0m;
            var lastAssessmentScore = attempts.FirstOrDefault()?.Percentage ?? 0m;
            var attemptCount = attempts.Count;
            var completedLessonCount = lessonProgresses.Count(x => x.Status == LearningProgressStatus.Completed);
            var revisionNeeded = topicProgresses.Any(x => x.NeedsRevision);
            var needsIntervention = revisionNeeded || attempts.Take(2).Count(x => !x.Passed) == 2;
            var completedTopics = topicProgresses.Count(x => x.Status == LearningProgressStatus.Completed);
            var progressStatus = completedTopics == topicIds.Count && topicIds.Count > 0
                ? "Completed"
                : attemptCount == 0 && completedLessonCount == 0
                    ? "NotStarted"
                    : "InProgress";

            var studentProgress = await _studentProgressRepository.FirstOrDefaultAsync(x => x.StudentId == studentId && x.SubjectId == subjectId);
            if (studentProgress == null)
            {
                studentProgress = new StudentProgress(Guid.NewGuid(), studentId, subjectId);
                await _studentProgressRepository.InsertAsync(studentProgress);
            }

            studentProgress.UpdateProgress(masteryScore, progressStatus, lastAssessmentScore, attemptCount, needsIntervention, completedLessonCount, revisionNeeded);
        }
    }
}
