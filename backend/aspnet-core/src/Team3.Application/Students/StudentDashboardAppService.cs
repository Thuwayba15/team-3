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

            var topics = await _topicRepository.GetAll().Where(x => enrolledSubjectIds.Contains(x.SubjectId) && x.IsActive).ToListAsync();
            var topicIds = topics.Select(x => x.Id).ToList();
            var lessons = await _lessonRepository.GetAll().Where(x => topicIds.Contains(x.TopicId)).ToListAsync();
            var lessonIds = lessons.Select(x => x.Id).ToList();

            var topicProgresses = await _topicProgressRepository.GetAll().Where(x => x.StudentId == studentId && topicIds.Contains(x.TopicId)).ToListAsync();
            var lessonProgresses = await _lessonProgressRepository.GetAll()
                .Where(x => x.StudentId == studentId && lessonIds.Contains(x.LessonId))
                .OrderByDescending(x => x.CompletedAt)
                .ToListAsync();
            var attempts = await _attemptRepository.GetAll()
                .Where(x => x.StudentId == studentId && enrolledSubjectIds.Contains(x.SubjectId) && x.AssessmentType == AssessmentType.Quiz)
                .OrderByDescending(x => x.SubmittedAt)
                .ToListAsync();
            var assessments = await _assessmentRepository.GetAll().Where(x => attempts.Select(a => a.AssessmentId).Contains(x.Id)).ToListAsync();
            var subjectProgressRecords = await _studentProgressRepository.GetAll().Where(x => x.StudentId == studentId && enrolledSubjectIds.Contains(x.SubjectId)).ToListAsync();

            return new StudentDashboardProgressDto
            {
                SubjectId = subjectId,
                SubjectName = subjectId.HasValue ? (await _subjectRepository.FirstOrDefaultAsync(subjectId.Value))?.Name : null,
                OverallScore = subjectProgressRecords.Any() ? Math.Round(subjectProgressRecords.Average(x => x.MasteryScore), 2, MidpointRounding.AwayFromZero) : 0m,
                TopicsMastered = topicProgresses.Count(x => x.Status == LearningProgressStatus.Completed),
                LessonsCompleted = lessonProgresses.Count(x => x.Status == LearningProgressStatus.Completed),
                QuizzesPassed = attempts.Count(x => x.Passed),
                NeedsIntervention = subjectProgressRecords.Any(x => x.NeedsIntervention),
                RecentQuizzes = attempts.Take(5).Select(attempt =>
                {
                    var assessment = assessments.FirstOrDefault(x => x.Id == attempt.AssessmentId);
                    var topic = topics.FirstOrDefault(x => x.Id == attempt.TopicId);
                    return new StudentDashboardRecentQuizDto
                    {
                        AttemptId = attempt.Id,
                        Title = assessment?.Title ?? "Quiz",
                        TopicName = topic?.Name ?? "Topic",
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
                        var lesson = lessons.FirstOrDefault(x => x.Id == progress.LessonId);
                        var topic = topics.FirstOrDefault(x => x.Id == progress.TopicId);
                        return new StudentDashboardCompletedLessonDto
                        {
                            LessonId = progress.LessonId,
                            Title = lesson?.Title ?? "Lesson",
                            TopicName = topic?.Name ?? "Topic",
                            CompletedAt = progress.CompletedAt
                        };
                    }).ToList(),
                WeakTopics = topicProgresses
                    .Where(x => x.NeedsRevision || x.MasteryScore < 50m)
                    .OrderBy(x => x.MasteryScore)
                    .Take(5)
                    .Select(progress =>
                    {
                        var topic = topics.FirstOrDefault(x => x.Id == progress.TopicId);
                        return new StudentDashboardWeakTopicDto
                        {
                            TopicId = progress.TopicId,
                            TopicName = topic?.Name ?? "Topic",
                            MasteryScore = progress.MasteryScore,
                            NeedsRevision = progress.NeedsRevision
                        };
                    }).ToList(),
                RecommendedLesson = GenerateRecommendedLesson(topicProgresses, topics, lessons),
                RevisionAdvices = GenerateRevisionAdvices(topicProgresses, topics),
                MotivationalGuidance = GenerateMotivationalGuidance(subjectProgressRecords)
            };
        }

        private StudentDashboardRecommendationDto? GenerateRecommendedLesson(
            List<StudentTopicProgress> topicProgresses,
            List<Topic> topics,
            List<Lesson> lessons)
        {
            if (!topicProgresses.Any())
                return null;

            var nextLesson = _recommendationEngine.SelectNextLessonByTopicProgress(topics, lessons, topicProgresses);
            if (nextLesson == null)
                return null;

            var topic = topics.FirstOrDefault(x => x.Id == nextLesson.TopicId);
            return new StudentDashboardRecommendationDto
            {
                LessonId = nextLesson.Id,
                LessonTitle = nextLesson.Title,
                TopicName = topic?.Name,
                Reason = "Recommended based on your learning progress"
            };
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
