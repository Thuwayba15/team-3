using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class AddFlexibleCurriculumExtractionDiagnostics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CandidateFamilies",
                table: "AppCurriculumExtractionJobs",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ClassificationConfidence",
                table: "AppCurriculumExtractionJobs",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ExtractionMode",
                table: "AppCurriculumExtractionJobs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "ParserConfidence",
                table: "AppCurriculumExtractionJobs",
                type: "double precision",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParserName",
                table: "AppCurriculumExtractionJobs",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WarningMessages",
                table: "AppCurriculumExtractionJobs",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CandidateFamilies",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "ClassificationConfidence",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "ExtractionMode",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "ParserConfidence",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "ParserName",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "WarningMessages",
                table: "AppCurriculumExtractionJobs");
        }
    }
}
