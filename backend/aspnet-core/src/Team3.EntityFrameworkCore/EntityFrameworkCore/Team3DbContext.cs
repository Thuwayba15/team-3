using Abp.Zero.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Migrations;
using System;
using Team3.Academic;
using Team3.AI;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.Configuration;
using Team3.Enums;
using Team3.Localization;
using Team3.MultiTenancy;
using Team3.Users;

namespace Team3.EntityFrameworkCore;

public class Team3DbContext : AbpZeroDbContext<Tenant, Role, User, Team3DbContext>
{
    /* Define a DbSet for each entity of the application */

    // Existing user profile entities
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<TutorProfile> TutorProfiles { get; set; }
    public DbSet<ParentProfile> ParentProfiles { get; set; }
    public DbSet<AdminProfile> AdminProfiles { get; set; }

    // Learning material upload entities
    public DbSet<Language> LearningLanguages { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Topic> Topics { get; set; }
    public DbSet<Lesson> Lessons { get; set; }
    public DbSet<LessonMaterial> LessonMaterials { get; set; }
    public DbSet<LessonTranslation> LessonTranslations { get; set; }
    public DbSet<SourceMaterial> SourceMaterials { get; set; }
    public DbSet<StudentEnrollment> StudentEnrollments { get; set; }
    public DbSet<StudentProgress> StudentProgresses { get; set; }

    // Per-user platform language preference
    public virtual DbSet<UserLanguagePreference> UserLanguagePreferences { get; set; }

    public Team3DbContext(DbContextOptions<Team3DbContext> options)
        : base(options)
    {
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.ConfigureWarnings(w =>
            // This explicitly tells EF to ignore the "Pending Changes" check
            w.Ignore(RelationalEventId.PendingModelChangesWarning));
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<StudentProfile>(entity =>
        {
            entity.ToTable("StudentProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.GradeLevel).IsRequired().HasMaxLength(32);
            entity.Property(x => x.ProgressLevel).HasMaxLength(64);
            entity.Property(x => x.SubjectInterests).HasMaxLength(512);
        });

        modelBuilder.Entity<TutorProfile>(entity =>
        {
            entity.ToTable("TutorProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.Specialization).HasMaxLength(128);
            entity.Property(x => x.Bio).HasMaxLength(1000);
            entity.Property(x => x.SubjectInterests).HasMaxLength(512);
        });

        modelBuilder.Entity<ParentProfile>(entity =>
        {
            entity.ToTable("ParentProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.RelationshipNotes).HasMaxLength(256);
        });

        modelBuilder.Entity<AdminProfile>(entity =>
        {
            entity.ToTable("AdminProfiles");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.PreferredLanguage).IsRequired().HasMaxLength(64);
            entity.Property(x => x.Department).HasMaxLength(128);
        });

        modelBuilder.Entity<Language>(entity =>
        {
            entity.ToTable("Languages");

            entity.HasIndex(x => x.Code).IsUnique();

            entity.Property(x => x.Code).IsRequired().HasMaxLength(10);
            entity.Property(x => x.Name).IsRequired().HasMaxLength(50);
            entity.Property(x => x.NativeName).HasMaxLength(50);
            entity.Property(x => x.IsActive).HasDefaultValue(true);
            entity.Property(x => x.IsDefault).HasDefaultValue(false);
            entity.Property(x => x.SortOrder).HasDefaultValue(0);
        });

        modelBuilder.Entity<Subject>(entity =>
        {
            entity.ToTable("Subjects");

            entity.HasIndex(x => x.Name).IsUnique();

            entity.Property(x => x.Name).IsRequired().HasMaxLength(100);
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.GradeLevel).IsRequired().HasMaxLength(20);
            entity.Property(x => x.IsActive).HasDefaultValue(true);
        });

        modelBuilder.Entity<Topic>(entity =>
        {
            entity.ToTable("Topics");

            entity.Property(x => x.Name).IsRequired().HasMaxLength(150);
            entity.Property(x => x.Description).HasMaxLength(1000);
            entity.Property(x => x.SequenceOrder).HasDefaultValue(0);
            entity.Property(x => x.IsActive).HasDefaultValue(true);
            entity.Property(x => x.MasteryThreshold).HasPrecision(4, 2).HasDefaultValue(0.70m);
            entity.Property(x => x.GeneratedByAI).HasDefaultValue(false);

            entity.HasOne(x => x.Subject)
                .WithMany(x => x.Topics)
                .HasForeignKey(x => x.SubjectId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Lesson>(entity =>
        {
            entity.ToTable("Lessons");

            entity.Property(x => x.Title).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Summary).HasMaxLength(2000);
            entity.Property(x => x.LearningObjective).HasMaxLength(500);
            entity.Property(x => x.RevisionSummary).HasMaxLength(1000);
            entity.Property(x => x.EstimatedMinutes).HasDefaultValue(15);
            entity.Property(x => x.IsPublished).HasDefaultValue(false);
            entity.Property(x => x.GeneratedByAI).HasDefaultValue(false);

            entity.HasOne(x => x.Topic)
                .WithMany(x => x.Lessons)
                .HasForeignKey(x => x.TopicId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LessonMaterial>(entity =>
        {
            entity.ToTable("LessonMaterials");

            entity.Property(x => x.Name).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Url).IsRequired().HasMaxLength(500);
            entity.Property(x => x.UploadedAt).IsRequired();

            entity.HasOne(x => x.Lesson)
                .WithMany(x => x.Materials)
                .HasForeignKey(x => x.LessonId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<LessonTranslation>(entity =>
        {
            entity.ToTable("LessonTranslations");

            entity.HasIndex(x => new { x.LessonId, x.LanguageId }).IsUnique();

            entity.Property(x => x.Title).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Content).IsRequired().HasColumnType("text");
            entity.Property(x => x.Summary).HasMaxLength(2000);
            entity.Property(x => x.RevisionSummary).HasMaxLength(1000);
            entity.Property(x => x.IsAutoTranslated).HasDefaultValue(false);

            entity.HasOne(x => x.Lesson)
                .WithMany(x => x.Translations)
                .HasForeignKey(x => x.LessonId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(x => x.Language)
                .WithMany()
                .HasForeignKey(x => x.LanguageId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<SourceMaterial>(entity =>
        {
            entity.ToTable("SourceMaterials");

            entity.Property(x => x.Title).IsRequired().HasMaxLength(200);
            entity.Property(x => x.Description).HasMaxLength(500);
            entity.Property(x => x.FileUrl).IsRequired().HasMaxLength(500);
            entity.Property(x => x.UploadedAt).IsRequired();
            entity.Property(x => x.GradeLevel).HasMaxLength(20);
            entity.Property(x => x.ProcessingStatus).HasDefaultValue(ProcessingStatus.Pending);

            entity.HasOne(x => x.UploadedBy)
                .WithMany()
                .HasForeignKey(x => x.UploadedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Language)
                .WithMany()
                .HasForeignKey(x => x.LanguageId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.Subject)
                .WithMany()
                .HasForeignKey(x => x.SubjectId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(x => x.GeneratedTopic)
                .WithMany()
                .HasForeignKey(x => x.GeneratedTopicId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.GeneratedEasyLesson)
                .WithMany()
                .HasForeignKey(x => x.GeneratedEasyLessonId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.GeneratedMediumLesson)
                .WithMany()
                .HasForeignKey(x => x.GeneratedMediumLessonId)
                .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(x => x.GeneratedHardLesson)
                .WithMany()
                .HasForeignKey(x => x.GeneratedHardLessonId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<UserLanguagePreference>(entity =>
        {
            entity.ToTable("AppUserLanguagePreferences");
            entity.HasIndex(x => x.UserId).IsUnique();

            entity.Property(x => x.LanguageCode).IsRequired().HasMaxLength(32);

            entity.HasOne<User>()
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
