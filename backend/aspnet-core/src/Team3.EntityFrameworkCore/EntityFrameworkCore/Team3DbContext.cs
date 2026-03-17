using Abp.Zero.EntityFrameworkCore;
using Team3.Authorization.Roles;
using Team3.Authorization.Users;
using Team3.MultiTenancy;
using Microsoft.EntityFrameworkCore;
using Team3.Users;

namespace Team3.EntityFrameworkCore;

public class Team3DbContext : AbpZeroDbContext<Tenant, Role, User, Team3DbContext>
{
    /* Define a DbSet for each entity of the application */
    public DbSet<StudentProfile> StudentProfiles { get; set; }
    public DbSet<TutorProfile> TutorProfiles { get; set; }
    public DbSet<ParentProfile> ParentProfiles { get; set; }
    public DbSet<AdminProfile> AdminProfiles { get; set; }

    public Team3DbContext(DbContextOptions<Team3DbContext> options)
        : base(options)
    {
    }

    public void OnModelCreating(ModelBuilder modelBuilder)
    {
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
    }
}
