using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class BackFillUserLanguagePreferences2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Backfill existing users with their language preferences
            // Use system default language if set, otherwise fallback to 'en'
            migrationBuilder.Sql(
                @"INSERT INTO ""AppUserLanguagePreferences"" (""UserId"", ""LanguageCode"", ""CreationTime"", ""IsDeleted"")
                  SELECT 
                    u.""Id"",
                    COALESCE((SELECT ""Code"" FROM ""Languages"" WHERE ""IsDefault"" = true AND ""IsActive"" = true AND ""IsDeleted"" = false LIMIT 1), 'en'),
                    NOW(),
                    false
                  FROM ""AbpUsers"" u
                  WHERE u.""Id"" NOT IN (SELECT ""UserId"" FROM ""AppUserLanguagePreferences"")
                    AND u.""IsDeleted"" = false;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // On rollback, remove the backfilled records
            migrationBuilder.Sql(@"DELETE FROM ""AppUserLanguagePreferences"" WHERE ""CreationTime"" >= NOW() - INTERVAL '1 minute' AND ""LanguageCode"" IN (SELECT ""Code"" FROM ""Languages"");");
        }
    }
}
