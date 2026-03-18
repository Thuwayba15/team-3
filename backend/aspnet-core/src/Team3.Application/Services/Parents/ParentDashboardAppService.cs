using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Runtime.Session;
using Abp.Domain.Repositories;
using Abp.UI;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Team3.Authorization.Users;
using Team3.Domain.Parents;
using Team3.Domain.Students.Team3.Students;
using Team3.Domain.Subjects;
using Team3.Services.Parents.Dto;
using Team3.Users;

namespace Team3.Services.Parents;

public class ParentDashboardAppService : Team3AppServiceBase, IParentDashboardAppService
{
    private readonly IRepository<ParentStudentLink,  long> _linkRepo;
    private readonly IRepository<StudentSubject,     Guid> _studentSubjectRepo;
    private readonly IRepository<Subject,            Guid> _subjectRepo;
    private readonly IRepository<StudentAlert,       long> _alertRepo;
    private readonly IRepository<StudentActivityLog, long> _activityRepo;
    private readonly IRepository<StudentProfile,     long> _studentProfileRepo;
    private readonly IRepository<User,               long> _userRepo;

    public ParentDashboardAppService(
        IRepository<ParentStudentLink,  long> linkRepo,
        IRepository<StudentSubject,     Guid> studentSubjectRepo,
        IRepository<Subject,            Guid> subjectRepo,
        IRepository<StudentAlert,       long> alertRepo,
        IRepository<StudentActivityLog, long> activityRepo,
        IRepository<StudentProfile,     long> studentProfileRepo,
        IRepository<User,               long> userRepo)
    {
        _linkRepo           = linkRepo;
        _studentSubjectRepo = studentSubjectRepo;
        _subjectRepo        = subjectRepo;
        _alertRepo          = alertRepo;
        _activityRepo       = activityRepo;
        _studentProfileRepo = studentProfileRepo;
        _userRepo           = userRepo;
    }

    public async Task<ParentDashboardDto> GetDashboardSummaryAsync(long? studentUserId = null)
    {
        var parentUserId = AbpSession.GetUserId();

        var link = studentUserId.HasValue
            ? await _linkRepo.FirstOrDefaultAsync(l => l.ParentUserId == parentUserId && l.StudentUserId == studentUserId.Value)
              ?? throw new UserFriendlyException("The specified student is not linked to your account.")
            : await _linkRepo.FirstOrDefaultAsync(l => l.ParentUserId == parentUserId)
              ?? throw new UserFriendlyException("No linked student found for this parent account.");

        var linkedStudentId = link.StudentUserId;

        // Student identity
        var studentUser    = await _userRepo.GetAsync(linkedStudentId);
        var studentProfile = await _studentProfileRepo.FirstOrDefaultAsync(p => p.UserId == linkedStudentId);

        var studentInfo = new StudentInfoDto
        {
            Name       = $"{studentUser.Name} {studentUser.Surname}",
            GradeLevel = studentProfile?.GradeLevel ?? "Unknown",
            School     = "Ubuntu High School",
            Initials   = BuildInitials(studentUser.Name, studentUser.Surname),
        };

        // Subject progress (enrolled subjects with mastery)
        var enrollments = await _studentSubjectRepo.GetAll()
            .Where(ss => ss.UserId == linkedStudentId)
            .ToListAsync();

        var subjectIds = enrollments.Select(e => e.SubjectId).ToList();

        var subjects = await _subjectRepo.GetAll()
            .Include(s => s.Translations)
            .Where(s => subjectIds.Contains(s.Id))
            .ToListAsync();

        var subjectProgress = enrollments
            .Select(e =>
            {
                var subject = subjects.FirstOrDefault(s => s.Id == e.SubjectId);
                var name    = subject?.Translations.FirstOrDefault(t => t.Language == "en")?.Name
                              ?? subject?.SubjectCode
                              ?? "Unknown";
                return new SubjectSummaryDto
                {
                    SubjectName = name,
                    Percent     = e.MasteryScore,
                };
            })
            .OrderBy(s => s.SubjectName)
            .ToList();

        // Overall average
        var overallAverage = enrollments.Count > 0
            ? (int)Math.Round(enrollments.Average(e => e.MasteryScore))
            : 0;

        // Lessons completed (count of completed-quiz + completed-module activities)
        var lessonsCompleted = await _activityRepo.CountAsync(
            a => a.StudentUserId == linkedStudentId
              && (a.ActivityType == ActivityType.CompletedQuiz || a.ActivityType == ActivityType.CompletedModule));

        // Time spent this week
        var weekStart       = DateTime.UtcNow.Date.AddDays(-(int)DateTime.UtcNow.DayOfWeek);
        var weekMinutes     = await _activityRepo.GetAll()
            .Where(a => a.StudentUserId == linkedStudentId && a.OccurredAt >= weekStart)
            .SumAsync(a => a.DurationMinutes);
        var timeSpent       = FormatMinutes(weekMinutes);

        // Recent alerts (top 3, not dismissed, newest first)
        var recentAlerts = await _alertRepo.GetAll()
            .Where(a => a.StudentUserId == linkedStudentId && !a.IsDismissed)
            .OrderByDescending(a => a.CreationTime)
            .Take(3)
            .ToListAsync();

        // Recent activity (top 4, newest first)
        var recentActivity = await _activityRepo.GetAll()
            .Where(a => a.StudentUserId == linkedStudentId)
            .OrderByDescending(a => a.OccurredAt)
            .Take(4)
            .ToListAsync();

        return new ParentDashboardDto
        {
            Child          = studentInfo,
            Stats          = new DashboardStatsDto
            {
                OverallAverage     = overallAverage,
                LessonsCompleted   = lessonsCompleted,
                TimeSpentThisWeek  = timeSpent,
            },
            SubjectProgress = subjectProgress,
            RecentAlerts    = recentAlerts.Select(MapAlertToDto).ToList(),
            RecentActivity  = recentActivity.Select(MapActivityToDto).ToList(),
        };
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private static RecentAlertDto MapAlertToDto(StudentAlert a) => new()
    {
        Id          = a.Id,
        Type        = a.Type.ToString().ToLower(),
        Title       = a.Title,
        Description = a.Description,
        When        = FormatWhen(a.CreationTime),
    };

    private static RecentActivityDto MapActivityToDto(StudentActivityLog a) => new()
    {
        ActivityType = MapActivityIcon(a.ActivityType),
        Title        = a.Title,
        When         = FormatWhen(a.OccurredAt),
        Score        = a.Score,
    };

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

    private static string FormatMinutes(int minutes)
    {
        var h = minutes / 60;
        var m = minutes % 60;
        return h > 0 ? $"{h}h {m:D2}m" : $"{m}m";
    }

    internal static string FormatWhen(DateTime utc)
    {
        var diff = DateTime.UtcNow - utc;
        if (diff.TotalMinutes < 60)  return $"{(int)diff.TotalMinutes} minutes ago";
        if (diff.TotalHours   < 24)  return $"{(int)diff.TotalHours} hours ago";
        if (diff.TotalDays    < 2)   return "Yesterday";
        if (diff.TotalDays    < 7)   return $"{(int)diff.TotalDays} days ago";
        if (diff.TotalDays    < 14)  return "Last week";
        return utc.ToString("MMM d", CultureInfo.InvariantCulture);
    }
}
