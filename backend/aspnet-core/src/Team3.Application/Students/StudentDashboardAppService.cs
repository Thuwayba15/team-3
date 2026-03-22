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
using Team3.Domain.Assessment;
using Team3.Enums;
using Team3.LearningMaterials;
using Team3.Students.Dto;

namespace Team3.Students
{
    [AbpAuthorize]
    public class StudentDashboardAppService : Team3AppServiceBase, IStudentDashboardAppService
    {
        private readonly IRepository<Subject, Guid> _subjectRepository;
        private readonly IRepository<Topic, Guid> _topicRepository;
        private readonly IRepository<Lesson, Guid> _lessonRepository;
        private readonly IRepository<StudentEnrollment, Guid> _enrollmentRepository;
        private readonly IRepository<StudentAssessmentAttempt, Guid> _attemptRepository;
        private readonly IRepository<StudentLessonProgress, Guid> _lessonProgressRepository;
        private readonly IRepository<StudentTopicProgress, Guid> _topicProgressRepository;
        private readonly IRepository<StudentProgress, Guid> _studentProgressRepository;
        private readonly IRepository<Assessment, Guid> _assessmentRepository;
        private readonly RecommendationEngine _recommendationEngine;

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
            RecommendationEngine recommendationEngine)
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
            _recommendationEngine = recommendationEngine;
        }

        public async Task<StudentDashboardProgressDto> GetProgressAsync(Guid? subjectId)
        {
            var studentId = AbpSession.GetUserId();

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
                return emptyResult;
            }

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
            var subjectNameById = subjects.ToDictionary(x => x.Id, x => x.Name);
            var topicById = topics.ToDictionary(x => x.Id);
            var lessonById = lessons.ToDictionary(x => x.Id);

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
                        TopicName = topicById.TryGetValue(attempt.TopicId, out var topic) ? topic.Name : "Topic",
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
                            TopicName = topicById.TryGetValue(progress.TopicId, out var topic) ? topic.Name : "Topic",
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
                            TopicName = topicById.TryGetValue(progress.TopicId, out var topic) ? topic.Name : "Topic",
                            MasteryScore = progress.MasteryScore,
                            NeedsRevision = progress.NeedsRevision
                        };
                    }).ToList(),
                TopicMasteries = topics
                    .Select(topic =>
                    {
                        var progress = topicProgresses.FirstOrDefault(x => x.TopicId == topic.Id);
                        var subjectName = subjectNameById.TryGetValue(topic.SubjectId, out var name) ? name : "Subject";

                        return new StudentDashboardTopicMasteryDto
                        {
                            TopicId = topic.Id,
                            TopicName = topic.Name,
                            SubjectName = subjectName,
                            MasteryScore = progress?.MasteryScore ?? 0m
                        };
                    })
                    .OrderBy(x => x.SubjectName)
                    .ThenBy(x => x.TopicName)
                    .ToList(),
                RecommendedLesson = GenerateRecommendedLesson(enrolledSubjectIds, subjects, topics, lessons, topicProgresses, lessonProgresses),
                RevisionAdvices = GenerateRevisionAdvices(topicProgresses, topics),
                MotivationalGuidance = GenerateMotivationalGuidance(subjectProgressRecords)
            };

            return result;
        }

        private StudentDashboardRecommendationDto? GenerateRecommendedLesson(
            List<Guid> enrolledSubjectIds,
            List<Subject> subjects,
            List<Topic> topics,
            List<Lesson> lessons,
            List<StudentTopicProgress> topicProgresses,
            List<StudentLessonProgress> lessonProgresses)
        {
            if (!enrolledSubjectIds.Any() || !topics.Any() || !lessons.Any())
                return null;

            var subjectOrder = subjects
                .OrderBy(x => x.Name)
                .Select((subject, index) => new { subject.Id, Index = index })
                .ToDictionary(x => x.Id, x => x.Index);
            var latestTopicProgressByTopicId = topicProgresses
                .GroupBy(x => x.TopicId)
                .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.LastModificationTime ?? x.CreationTime).First());
            var latestLessonProgressByLessonId = lessonProgresses
                .GroupBy(x => x.LessonId)
                .ToDictionary(g => g.Key, g => g.OrderByDescending(x => x.LastModificationTime ?? x.CreationTime).First());

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
                    SubjectName = subject?.Name,
                    LessonId = nextLesson.Id,
                    LessonTitle = nextLesson.Title,
                    TopicName = firstUnlockedTopic.Name,
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
            List<Topic> topics)
        {
            var weaknessInsights = _recommendationEngine.RankWeakTopicsByTopicProgress(topics, topicProgresses, 3);
            return weaknessInsights
                .Select(insight =>
                {
                    var topic = topics.FirstOrDefault(x => x.Id == insight.TopicId);
                    return new StudentDashboardRevisionAdviceDto
                    {
                        TopicName = topic?.Name,
                        MasteryScore = insight.MasteryPercent,
                        Advice = $"Focus on revising {topic?.Name ?? "this topic"} to improve your mastery."
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
    }
}
