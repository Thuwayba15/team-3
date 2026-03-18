using Abp.Zero.EntityFrameworkCore;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using Team3.Users;
using Team3.Curriculum.Entities;

namespace Team3.EntityFrameworkCore;

public class Team3DbContext : AbpZeroDbContext<Tenant, Role, User, Team3DbContext>
{
    /* Define a DbSet for each entity of the application */
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<TutorProfile> TutorProfiles { get; set; }
    public DbSet<ParentProfile> ParentProfiles { get; set; }
    public DbSet<AdminProfile> AdminProfiles { get; set; }

    // Curriculum entities
    public DbSet<CurriculumSourceDocument> CurriculumSourceDocuments { get; set; }
    public DbSet<CurriculumExtractionJob> CurriculumExtractionJobs { get; set; }
    public DbSet<ParsedStructureNode> ParsedStructureNodes { get; set; }
    public DbSet<TopicDraft> TopicDrafts { get; set; }
    public DbSet<LessonDraft> LessonDrafts { get; set; }
    public DbSet<LessonMaterialDraft> LessonMaterialDrafts { get; set; }
    public DbSet<QuizDraft> QuizDrafts { get; set; }
    public DbSet<QuizQuestionDraft> QuizQuestionDrafts { get; set; }

    public Team3DbContext(DbContextOptions<Team3DbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
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

        // Curriculum configurations
        modelBuilder.Entity<CurriculumSourceDocument>(entity =>
        {
            entity.ToTable("AppCurriculumSourceDocuments");
            entity.Property(x => x.SubjectName).IsRequired().HasMaxLength(256);
            entity.Property(x => x.GradeLevel).IsRequired().HasMaxLength(64);
            entity.Property(x => x.FilePath).IsRequired().HasMaxLength(512);
            entity.Property(x => x.OriginalFileName).IsRequired().HasMaxLength(256);
            entity.Property(x => x.ContentType).HasMaxLength(128);
        });

        modelBuilder.Entity<CurriculumExtractionJob>(entity =>
        {
            entity.ToTable("AppCurriculumExtractionJobs");
            entity.HasIndex(x => x.SourceDocumentId);
            entity.Property(x => x.ErrorMessage).HasMaxLength(1024);
        });

        modelBuilder.Entity<ParsedStructureNode>(entity =>
        {
            entity.ToTable("AppParsedStructureNodes");
            entity.HasIndex(x => x.ExtractionJobId);
            entity.HasIndex(x => x.ParentNodeId);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(512);
            entity.Property(x => x.Content).HasMaxLength(4000);
        });

        modelBuilder.Entity<TopicDraft>(entity =>
        {
            entity.ToTable("AppTopicDrafts");
            entity.HasIndex(x => x.ExtractionJobId);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(256);
            entity.Property(x => x.Description).HasMaxLength(1000);
        });

        modelBuilder.Entity<LessonDraft>(entity =>
        {
            entity.ToTable("AppLessonDrafts");
            entity.HasIndex(x => x.TopicDraftId);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(256);
            entity.Property(x => x.Description).HasMaxLength(1000);
        });

        modelBuilder.Entity<LessonMaterialDraft>(entity =>
        {
            entity.ToTable("AppLessonMaterialDrafts");
            entity.HasIndex(x => x.LessonDraftId);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(256);
            entity.Property(x => x.Content).HasMaxLength(4000);
        });

        modelBuilder.Entity<QuizDraft>(entity =>
        {
            entity.ToTable("AppQuizDrafts");
            entity.HasIndex(x => x.LessonDraftId);
            entity.Property(x => x.Title).IsRequired().HasMaxLength(256);
            entity.Property(x => x.Description).HasMaxLength(1000);
        });

        modelBuilder.Entity<QuizQuestionDraft>(entity =>
        {
            entity.ToTable("AppQuizQuestionDrafts");
            entity.HasIndex(x => x.QuizDraftId);
            entity.Property(x => x.QuestionText).IsRequired().HasMaxLength(1000);
            entity.Property(x => x.OptionA).HasMaxLength(500);
            entity.Property(x => x.OptionB).HasMaxLength(500);
            entity.Property(x => x.OptionC).HasMaxLength(500);
            entity.Property(x => x.OptionD).HasMaxLength(500);
            entity.Property(x => x.CorrectAnswer).IsRequired().HasMaxLength(1);
            entity.Property(x => x.Explanation).HasMaxLength(1000);
        });
    }
}
