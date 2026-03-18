using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Domain.Repositories;
using Abp.Runtime.Session;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using Team3.Authorization.Users;
using Team3.Domain.Parents;
using Team3.Domain.Students.Team3.Students;
using Team3.Domain.Subjects;
using Team3.Services.Parents.Dto;
using Team3.Users;

namespace Team3.Services.Parents;

public class ParentChildProgressAppService : Team3AppServiceBase, IParentChildProgressAppService
{
    private readonly IRepository<ParentStudentLink,    long> _linkRepo;
    private readonly IRepository<StudentSubject,       Guid> _studentSubjectRepo;
    private readonly IRepository<Subject,              Guid> _subjectRepo;
    private readonly IRepository<Topic,                Guid> _topicRepo;
    private readonly IRepository<StudentTopicProgress, long> _topicProgressRepo;
    private readonly IRepository<AssessmentResult,     long> _assessmentRepo;
    private readonly IRepository<StudentActivityLog,   long> _activityRepo;
    private readonly IRepository<StudentProfile,       long> _studentProfileRepo;
    private readonly IRepository<User,                 long> _userRepo;

    public ParentChildProgressAppService(
        IRepository<ParentStudentLink,    long> linkRepo,
        IRepository<StudentSubject,       Guid> studentSubjectRepo,
        IRepository<Subject,              Guid> subjectRepo,
        IRepository<Topic,                Guid> topicRepo,
        IRepository<StudentTopicProgress, long> topicProgressRepo,
        IRepository<AssessmentResult,     long> assessmentRepo,
        IRepository<StudentActivityLog,   long> activityRepo,
        IRepository<StudentProfile,       long> studentProfileRepo,
        IRepository<User,                 long> userRepo)
    {
        _linkRepo           = linkRepo;
        _studentSubjectRepo = studentSubjectRepo;
        _subjectRepo        = subjectRepo;
        _topicRepo          = topicRepo;
        _topicProgressRepo  = topicProgressRepo;
        _assessmentRepo     = assessmentRepo;
        _activityRepo       = activityRepo;
        _studentProfileRepo = studentProfileRepo;
        _userRepo           = userRepo;
    }

    public async Task<ChildProgressDto> GetChildProgressAsync()
    {
        var parentUserId = AbpSession.GetUserId();

        var link = await _linkRepo.FirstOrDefaultAsync(l => l.ParentUserId == parentUserId)
            ?? throw new UserFriendlyException("No linked student found for this parent account.");

        var studentUserId = link.StudentUserId;

        // Student identity
        var studentUser    = await _userRepo.GetAsync(studentUserId);
        var studentProfile = await _studentProfileRepo.FirstOrDefaultAsync(p => p.UserId == studentUserId);

        var studentInfo = new StudentInfoDto
        {
            Name       = $"{studentUser.Name} {studentUser.Surname}",
            GradeLevel = studentProfile?.GradeLevel ?? "Unknown",
            School     = "Ubuntu High School",
            Initials   = BuildInitials(studentUser.Name, studentUser.Surname),
        };

        // Enrolled subjects with mastery
        var enrollments = await _studentSubjectRepo.GetAll()
            .Where(ss => ss.UserId == studentUserId)
            .ToListAsync();

        var subjectIds = enrollments.Select(e => e.SubjectId).ToList();

        var subjects = await _subjectRepo.GetAll()
            .Include(s => s.Translations)
            .Where(s => subjectIds.Contains(s.Id))
            .ToListAsync();

        // Topic progress per student
        var topicProgresses = await _topicProgressRepo.GetAll()
            .Where(tp => tp.StudentUserId == studentUserId && subjectIds.Contains(tp.SubjectId))
            .ToListAsync();

        var topicIds = topicProgresses.Select(tp => tp.TopicId).Distinct().ToList();

        var topics = await _topicRepo.GetAll()
            .Include(t => t.Translations)
            .Where(t => topicIds.Contains(t.Id))
            .ToListAsync();

        // Build subject cards with topic breakdowns
        var subjectCards = enrollments.Select(e =>
        {
            var subject    = subjects.FirstOrDefault(s => s.Id == e.SubjectId);
            var subjectName = subject?.Translations.FirstOrDefault(t => t.Language == "en")?.Name
                              ?? subject?.SubjectCode ?? "Unknown";

            var subjectTopics = topicProgresses
                .Where(tp => tp.SubjectId == e.SubjectId)
                .OrderByDescending(tp => tp.LastAttemptedAt)
                .Take(3)
                .Select(tp =>
                {
                    var topic     = topics.FirstOrDefault(t => t.Id == tp.TopicId);
                    var topicName = topic?.Translations.FirstOrDefault(t => t.Language == "en")?.Title
                                    ?? "Unknown";
                    return new TopicProgressDto { TopicName = topicName, Percent = tp.MasteryScore };
                })
                .ToList();

            return new SubjectWithTopicsDto
            {
                SubjectName = subjectName,
                Percent     = e.MasteryScore,
                Topics      = subjectTopics,
            };
        })
        .OrderBy(s => s.SubjectName)
        .ToList();

        // Top 8 topic mastery tiles (all topics, sorted by mastery desc)
        var masteryTiles = topicProgresses
            .OrderByDescending(tp => tp.MasteryScore)
            .Take(8)
            .Select(tp =>
            {
                var topic     = topics.FirstOrDefault(t => t.Id == tp.TopicId);
                var topicName = topic?.Translations.FirstOrDefault(t => t.Language == "en")?.Title
                                ?? "Unknown";
                return new TopicMasteryDto { TopicName = topicName, Percent = tp.MasteryScore };
            })
            .ToList();

        // Recent assessments (top 4, newest first)
        var assessments = await _assessmentRepo.GetAll()
            .Where(a => a.StudentUserId == studentUserId)
            .OrderByDescending(a => a.OccurredAt)
            .Take(4)
            .ToListAsync();

        var assessmentDtos = assessments.Select(a =>
        {
            var topic     = topics.FirstOrDefault(t => t.Id == a.TopicId);
            var topicName = topic?.Translations.FirstOrDefault(t => t.Language == "en")?.Title
                            ?? "Unknown";
            return new AssessmentResultDto
            {
                Title     = a.Title,
                TopicName = topicName,
                When      = ParentDashboardAppService.FormatWhen(a.OccurredAt),
                Score     = a.Score,
            };
        }).ToList();

        // Recent activity (top 4)
        var activities = await _activityRepo.GetAll()
            .Where(a => a.StudentUserId == studentUserId)
            .OrderByDescending(a => a.OccurredAt)
            .Take(4)
            .ToListAsync();

        var activityDtos = activities.Select(a => new RecentActivityDto
        {
            ActivityType = MapActivityIcon(a.ActivityType),
            Title        = a.Title,
            When         = ParentDashboardAppService.FormatWhen(a.OccurredAt),
            Score        = a.Score,
        }).ToList();

        return new ChildProgressDto
        {
            Child             = studentInfo,
            Subjects          = subjectCards,
            TopicMastery      = masteryTiles,
            RecentAssessments = assessmentDtos,
            RecentActivity    = activityDtos,
        };
    }

    private static string MapActivityIcon(ActivityType type) => type switch
    {
        ActivityType.CompletedQuiz   => "book",
        ActivityType.UsedAITutor     => "robot",
        ActivityType.StartedLesson   => "alert",
        ActivityType.CompletedModule => "check",
        _                            => "book",
    };

    private static string BuildInitials(string name, string surname)
    {
        var n = name.Length    > 0 ? name[0].ToString().ToUpper()    : "";
        var s = surname.Length > 0 ? surname[0].ToString().ToUpper() : "";
        return n + s;
    }
}
