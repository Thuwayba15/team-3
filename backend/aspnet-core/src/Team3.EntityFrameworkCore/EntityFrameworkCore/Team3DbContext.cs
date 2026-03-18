using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.Domain.Students.Team3.Students;
using Team3.Domain.Subjects;
using Team3.Localization;
using Team3.MultiTenancy;
using Team3.Users;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Team3.EntityFrameworkCore;

public class Team3DbContext : AbpZeroDbContext<Tenant, Role, User, Team3DbContext>
{
    /* Define a DbSet for each entity of the application */
    //Student
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    // Tutor/Teacher
    public DbSet<TutorProfile> TutorProfiles { get; set; }
    // Parent
    public DbSet<ParentProfile> ParentProfiles { get; set; }
    // Admin
    public DbSet<AdminProfile> AdminProfiles { get; set; }

    // Platform UI languages
    public DbSet<UILanguage> UILanguages { get; set; }

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

    public void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<StudentProfile>(entity =>
        {
            entity.ToTable("AppStudentProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.GradeLevel).IsRequired().HasMaxLength(32);
            entity.Property(x => x.ProgressLevel).HasMaxLength(64);
            entity.Property(x => x.SubjectInterests).HasMaxLength(512);
        });

        modelBuilder.Entity<TutorProfile>(entity =>
        {
            entity.ToTable("AppTutorProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.Specialization).HasMaxLength(128);
            entity.Property(x => x.Bio).HasMaxLength(1000);
            entity.Property(x => x.SubjectInterests).HasMaxLength(512);
        });

        modelBuilder.Entity<ParentProfile>(entity =>
        {
            entity.ToTable("AppParentProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.RelationshipNotes).HasMaxLength(256);
        });

        modelBuilder.Entity<AdminProfile>(entity =>
        {
            entity.ToTable("AppAdminProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.Department).HasMaxLength(128);
        });

        modelBuilder.Entity<UILanguage>(entity =>
        {
            entity.ToTable("AppUILanguages");
            entity.HasIndex(x => x.Code).IsUnique();

            entity.Property(x => x.Code).IsRequired().HasMaxLength(16);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(64);
            entity.Property(x => x.IsActive).IsRequired();
            entity.Property(x => x.IsDefault).IsRequired();
        });
    }
}
