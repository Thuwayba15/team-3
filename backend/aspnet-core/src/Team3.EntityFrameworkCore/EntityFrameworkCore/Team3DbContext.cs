using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.Domain.Parents;
using Team3.Domain.Students.Team3.Students;
using Team3.Domain.Subjects;
using Team3.Domain.Tutoring;
using Team3.MultiTenancy;
using Team3.Users;

namespace Team3.EntityFrameworkCore;

public class Team3DbContext : AbpZeroDbContext<Tenant, Role, User, Team3DbContext>
{
    /* Define a DbSet for each entity of the application */
    // Student
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    // Tutor/Teacher
    public DbSet<TutorProfile> TutorProfiles { get; set; }
    // Parent
    public DbSet<ParentProfile> ParentProfiles { get; set; }
    // Admin
    public DbSet<AdminProfile> AdminProfiles { get; set; }

    // Subjects
    public virtual DbSet<Subject> Subjects { get; set; }
    public virtual DbSet<SubjectTranslation> SubjectTranslations { get; set; }

    // Topics
    public virtual DbSet<Topic> Topics { get; set; }
    public virtual DbSet<TopicTranslation> TopicTranslations { get; set; }

    // Lessons
    public virtual DbSet<Lesson> Lessons { get; set; }
    public virtual DbSet<LessonTranslation> LessonTranslations { get; set; }
    public virtual DbSet<LessonMaterial> LessonMaterials { get; set; }

    // Students
    public virtual DbSet<StudentSubject> StudentSubjects { get; set; }

    // Parents
    public virtual DbSet<ParentStudentLink> ParentStudentLinks { get; set; }
    public virtual DbSet<StudentAlert> StudentAlerts { get; set; }
    public virtual DbSet<StudentActivityLog> StudentActivityLogs { get; set; }
    public virtual DbSet<AssessmentResult> AssessmentResults { get; set; }
    public virtual DbSet<StudentTopicProgress> StudentTopicProgresses { get; set; }

    // Tutoring
    public virtual DbSet<StudentTutorRequest> StudentTutorRequests { get; set; }
    public virtual DbSet<StudentTutorLink> StudentTutorLinks { get; set; }

    public Team3DbContext(DbContextOptions<Team3DbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
        optionsBuilder.ConfigureWarnings(w =>
            w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ParentStudentLink>(e =>
        {
            e.ToTable("AppParentStudentLinks");
            e.Property(x => x.RelationshipType).IsRequired().HasMaxLength(32);
            e.HasIndex(x => new { x.ParentUserId, x.StudentUserId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");
        });

        modelBuilder.Entity<StudentAlert>(e =>
        {
            e.ToTable("AppStudentAlerts");
            e.Property(x => x.Title).IsRequired().HasMaxLength(256);
            e.Property(x => x.Description).IsRequired().HasMaxLength(1024);
        });

        modelBuilder.Entity<StudentActivityLog>(e =>
        {
            e.ToTable("AppStudentActivityLogs");
            e.Property(x => x.Title).IsRequired().HasMaxLength(256);
        });

        modelBuilder.Entity<AssessmentResult>(e =>
        {
            e.ToTable("AppAssessmentResults");
            e.Property(x => x.Title).IsRequired().HasMaxLength(256);
        });

        modelBuilder.Entity<StudentTopicProgress>(e =>
        {
            e.ToTable("AppStudentTopicProgresses");
            e.HasIndex(x => new { x.StudentUserId, x.TopicId }).IsUnique();
        });

        modelBuilder.Entity<StudentTutorRequest>(e =>
        {
            e.ToTable("AppStudentTutorRequests");
            e.HasIndex(x => new { x.StudentUserId, x.TutorUserId })
                .IsUnique()
                .HasFilter($"\"Status\" = {(int)StudentTutorRequestStatus.Pending} AND \"IsDeleted\" = false");
        });

        modelBuilder.Entity<StudentTutorLink>(e =>
        {
            e.ToTable("AppStudentTutorLinks");
            e.HasIndex(x => new { x.StudentUserId, x.TutorUserId })
                .IsUnique()
                .HasFilter("\"IsDeleted\" = false");
        });
    }
}
