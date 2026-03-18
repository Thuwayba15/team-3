using System;
using System.Collections.Generic;
using System.Linq;
using Abp.Authorization.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Team3.Authorization.Users;
using Team3.Domain.Parents;
using Team3.Domain.Students.Team3.Students;
using Team3.Domain.Subjects;
using Team3.Users;

namespace Team3.EntityFrameworkCore.Seed.Host;

/// <summary>
/// Seeds a demo parent + student pair with realistic mock data for the parent portal pages.
/// All inserts are idempotent — skipped if data already exists.
/// </summary>
public class InitialParentDataBuilder
{
    private readonly Team3DbContext _context;

    public InitialParentDataBuilder(Team3DbContext context)
    {
        _context = context;
    }

    public void Create()
    {
        var studentUser = EnsureUser("demo.student.thabo", "Thabo", "Mokoena", UserRoleNames.Student);
        var parentUser  = EnsureUser("demo.parent.mokoena", "Sarah", "Mokoena", UserRoleNames.Parent);

        EnsureStudentProfile(studentUser.Id, "Grade 12");
        EnsureParentProfile(parentUser.Id);
        EnsureParentStudentLink(parentUser.Id, studentUser.Id);

        var mathSubject    = GetSubject("MATHEMATICS-G12");
        var physSubject    = GetSubject("PHYSICAL-SCIENCES-G12");
        var lifeSubject    = GetSubject("LIFE-SCIENCES-G12");
        var englishSubject = GetSubject("ENGLISH-HOME-LANGUAGE-G12");

        // Subjects not yet seeded — parent data will be added on next startup
        if (mathSubject == null || physSubject == null ||
            lifeSubject == null || englishSubject == null)
            return;

        EnsureStudentSubject(studentUser.Id, mathSubject.Id,    masteryScore: 82);
        EnsureStudentSubject(studentUser.Id, physSubject.Id,    masteryScore: 75);
        EnsureStudentSubject(studentUser.Id, lifeSubject.Id,    masteryScore: 60);
        EnsureStudentSubject(studentUser.Id, englishSubject.Id, masteryScore: 88);

        // Topic progress — first 3 topics per subject, sorted by SortOrder
        SeedTopicProgress(studentUser.Id, mathSubject.Id,
            new[] { (sortOrder: 1, score: 95), (2, 75), (3, 65) });

        SeedTopicProgress(studentUser.Id, physSubject.Id,
            new[] { (sortOrder: 1, score: 80), (2, 70), (3, 75) });

        SeedTopicProgress(studentUser.Id, lifeSubject.Id,
            new[] { (sortOrder: 1, score: 55), (2, 65), (3, 60) });

        SeedTopicProgress(studentUser.Id, englishSubject.Id,
            new[] { (sortOrder: 1, score: 97), (2, 82), (3, 80) });

        SeedAlerts(studentUser.Id, parentUser.Id);

        SeedActivities(studentUser.Id, mathSubject.Id, lifeSubject.Id);

        SeedAssessments(studentUser.Id,
            mathSubject.Id, physSubject.Id, lifeSubject.Id, englishSubject.Id);

        _context.SaveChanges();
    }

    // ─── User & profile helpers ───────────────────────────────────────────────

    private User EnsureUser(string userName, string name, string surname, string roleName)
    {
        var user = _context.Users.IgnoreQueryFilters()
                       .FirstOrDefault(u => u.UserName == userName);

        if (user != null) return user;

        user = new User
        {
            UserName               = userName,
            Name                   = name,
            Surname                = surname,
            EmailAddress           = $"{userName}@demo.ubuntulearn.co.za",
            NormalizedUserName     = userName.ToUpperInvariant(),
            NormalizedEmailAddress = $"{userName}@demo.ubuntulearn.co.za".ToUpperInvariant(),
            IsEmailConfirmed       = true,
            IsActive               = true,
            TenantId               = null,
        };

        user.Password = new PasswordHasher<User>(
            new OptionsWrapper<PasswordHasherOptions>(new PasswordHasherOptions()))
            .HashPassword(user, "Demo@1234");

        _context.Users.Add(user);
        _context.SaveChanges();

        var role = _context.Roles.FirstOrDefault(r => r.Name == roleName);
        if (role != null)
        {
            _context.UserRoles.Add(new UserRole(null, user.Id, role.Id));
            _context.SaveChanges();
        }

        return user;
    }

    private void EnsureStudentProfile(long userId, string gradeLevel)
    {
        if (_context.StudentProfiles.Any(p => p.UserId == userId)) return;
        _context.StudentProfiles.Add(new StudentProfile(userId, "en", gradeLevel, null, null));
        _context.SaveChanges();
    }

    private void EnsureParentProfile(long userId)
    {
        if (_context.ParentProfiles.Any(p => p.UserId == userId)) return;
        _context.ParentProfiles.Add(new ParentProfile(userId, "en", null));
        _context.SaveChanges();
    }

    private void EnsureParentStudentLink(long parentUserId, long studentUserId)
    {
        if (_context.ParentStudentLinks
                .Any(l => l.ParentUserId == parentUserId && l.StudentUserId == studentUserId))
            return;

        _context.ParentStudentLinks.Add(new ParentStudentLink(parentUserId, studentUserId));
        _context.SaveChanges();
    }

    // ─── Subject & topic helpers ──────────────────────────────────────────────

    private Subject? GetSubject(string code) =>
        _context.Subjects.FirstOrDefault(s => s.SubjectCode == code);

    private void EnsureStudentSubject(long userId, Guid subjectId, int masteryScore)
    {
        var existing = _context.StudentSubjects
            .FirstOrDefault(ss => ss.UserId == userId && ss.SubjectId == subjectId);

        if (existing != null)
        {
            existing.UpdateProgress(masteryScore, masteryScore);
            _context.SaveChanges();
            return;
        }

        var ss = new StudentSubject(userId, subjectId);
        ss.UpdateProgress(masteryScore, masteryScore);
        _context.StudentSubjects.Add(ss);
        _context.SaveChanges();
    }

    private void SeedTopicProgress(long userId, Guid subjectId,
        (int sortOrder, int score)[] entries)
    {
        var topics = _context.Topics
            .Where(t => t.SubjectId == subjectId)
            .OrderBy(t => t.SortOrder)
            .ToList();

        foreach (var (sortOrder, score) in entries)
        {
            var topic = topics.FirstOrDefault(t => t.SortOrder == sortOrder);
            if (topic == null) continue;

            if (_context.StudentTopicProgresses
                    .Any(tp => tp.StudentUserId == userId && tp.TopicId == topic.Id))
                continue;

            _context.StudentTopicProgresses.Add(
                new StudentTopicProgress(userId, subjectId, topic.Id, score,
                    DateTime.UtcNow.AddDays(-sortOrder)));
        }

        _context.SaveChanges();
    }

    // ─── Alert seeder ─────────────────────────────────────────────────────────

    private void SeedAlerts(long studentUserId, long parentUserId)
    {
        if (_context.StudentAlerts.Any(a => a.StudentUserId == studentUserId)) return;

        _context.StudentAlerts.AddRange(
            new StudentAlert(studentUserId, parentUserId, AlertCategory.Academic, AlertType.Warning,
                "Low Quiz Score",
                "Thabo scored 38% on Life Sciences: Cell Structure quiz."),

            new StudentAlert(studentUserId, parentUserId, AlertCategory.Activity, AlertType.Reminder,
                "Missed Study Session",
                "Thabo hasn't logged in for 2 days. Consistent practice is key to mastery."),

            new StudentAlert(studentUserId, parentUserId, AlertCategory.Academic, AlertType.Success,
                "Achievement Unlocked",
                "Thabo mastered Algebraic Expressions!"),

            new StudentAlert(studentUserId, parentUserId, AlertCategory.Academic, AlertType.Warning,
                "Intervention Recommended",
                "Teacher flagged Thabo for extra help with Fractions."),

            new StudentAlert(studentUserId, parentUserId, AlertCategory.System, AlertType.Info,
                "New Module Available",
                "Physical Sciences: Electricity module is now available."),

            new StudentAlert(studentUserId, parentUserId, AlertCategory.Academic, AlertType.Success,
                "Quiz Passed",
                "Thabo scored 85% on Mathematics: Linear Equations."),

            new StudentAlert(studentUserId, parentUserId, AlertCategory.Activity, AlertType.Reminder,
                "Study Reminder",
                "Thabo has a Physics quiz due tomorrow.")
        );

        _context.SaveChanges();
    }

    // ─── Activity log seeder ──────────────────────────────────────────────────

    private void SeedActivities(long studentUserId, Guid mathSubjectId, Guid lifeSubjectId)
    {
        if (_context.StudentActivityLogs.Any(a => a.StudentUserId == studentUserId)) return;

        var now = DateTime.UtcNow;

        _context.StudentActivityLogs.AddRange(
            new StudentActivityLog(studentUserId, ActivityType.CompletedQuiz,
                "Completed Quiz: Exponents and Surds",
                now.AddHours(-2), durationMinutes: 25, subjectId: mathSubjectId, score: 85),

            new StudentActivityLog(studentUserId, ActivityType.UsedAITutor,
                "Used AI Tutor for Life Sciences",
                now.AddDays(-1).AddHours(-4), durationMinutes: 45, subjectId: lifeSubjectId),

            new StudentActivityLog(studentUserId, ActivityType.StartedLesson,
                "Started Lesson: Nucleic Acids",
                now.AddDays(-1).AddHours(-6), durationMinutes: 30, subjectId: lifeSubjectId),

            new StudentActivityLog(studentUserId, ActivityType.CompletedModule,
                "Completed Module: Algebraic Expressions",
                now.AddDays(-3), durationMinutes: 60, subjectId: mathSubjectId)
        );

        _context.SaveChanges();
    }

    // ─── Assessment result seeder ─────────────────────────────────────────────

    private void SeedAssessments(long studentUserId,
        Guid mathId, Guid physId, Guid lifeId, Guid englishId)
    {
        if (_context.AssessmentResults.Any(a => a.StudentUserId == studentUserId)) return;

        var mathTopics    = GetTopicsBySubject(mathId);
        var physTopics    = GetTopicsBySubject(physId);
        var lifeTopics    = GetTopicsBySubject(lifeId);
        var englishTopics = GetTopicsBySubject(englishId);

        var now     = DateTime.UtcNow;
        var results = new List<AssessmentResult>();

        if (mathTopics.Count >= 2)
            results.Add(new AssessmentResult(studentUserId, mathId, mathTopics[1].Id,
                "Mathematics Quiz", AssessmentType.Quiz, 89, now.AddDays(-7)));

        if (lifeTopics.Count >= 1)
            results.Add(new AssessmentResult(studentUserId, lifeId, lifeTopics[0].Id,
                "Life Sciences Test", AssessmentType.Test, 55, now.AddDays(-1)));

        if (englishTopics.Count >= 1)
            results.Add(new AssessmentResult(studentUserId, englishId, englishTopics[0].Id,
                "English Assignment", AssessmentType.Assignment, 90, now.AddDays(-2)));

        if (physTopics.Count >= 1)
            results.Add(new AssessmentResult(studentUserId, physId, physTopics[0].Id,
                "Physical Sciences Quiz", AssessmentType.Quiz, 88, now.AddDays(-10)));

        _context.AssessmentResults.AddRange(results);
        _context.SaveChanges();
    }

    private List<Topic> GetTopicsBySubject(Guid subjectId) =>
        _context.Topics
            .Where(t => t.SubjectId == subjectId)
            .OrderBy(t => t.SortOrder)
            .ToList();
}
