using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class RemovePlatformLanguageCode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Remove column safely even if environments are already partially cleaned up.
            migrationBuilder.Sql("ALTER TABLE \"StudentProfiles\" DROP COLUMN IF EXISTS \"PlatformLanguageCode\";");
            migrationBuilder.Sql("ALTER TABLE \"TutorProfiles\" DROP COLUMN IF EXISTS \"PlatformLanguageCode\";");
            migrationBuilder.Sql("ALTER TABLE \"ParentProfiles\" DROP COLUMN IF EXISTS \"PlatformLanguageCode\";");
            migrationBuilder.Sql("ALTER TABLE \"AdminProfiles\" DROP COLUMN IF EXISTS \"PlatformLanguageCode\";");

            // Legacy cleanup from earlier iterations; tolerate table already being absent.
            migrationBuilder.Sql("DROP TABLE IF EXISTS \"AppUILanguages\";");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PlatformLanguageCode",
                table: "AppStudentProfiles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlatformLanguageCode",
                table: "AppTutorProfiles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlatformLanguageCode",
                table: "AppParentProfiles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlatformLanguageCode",
                table: "AppAdminProfiles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: true);
        }
    }
}
