using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class RefactorCurriculumSourceToRemotePdfUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FilePath",
                table: "AppCurriculumSourceDocuments");

            migrationBuilder.AlterColumn<long>(
                name: "FileSize",
                table: "AppCurriculumSourceDocuments",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<string>(
                name: "DownloadErrorMessage",
                table: "AppCurriculumSourceDocuments",
                type: "character varying(1024)",
                maxLength: 1024,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastFetchedAt",
                table: "AppCurriculumSourceDocuments",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SourceKind",
                table: "AppCurriculumSourceDocuments",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "SourceUrl",
                table: "AppCurriculumSourceDocuments",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DownloadedContentType",
                table: "AppCurriculumExtractionJobs",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "DownloadedFileSize",
                table: "AppCurriculumExtractionJobs",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ProcessingStage",
                table: "AppCurriculumExtractionJobs",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "SourceUrlSnapshot",
                table: "AppCurriculumExtractionJobs",
                type: "character varying(2048)",
                maxLength: 2048,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppCurriculumSourceDocuments_SourceUrl",
                table: "AppCurriculumSourceDocuments",
                column: "SourceUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AppCurriculumSourceDocuments_SourceUrl",
                table: "AppCurriculumSourceDocuments");

            migrationBuilder.DropColumn(
                name: "DownloadErrorMessage",
                table: "AppCurriculumSourceDocuments");

            migrationBuilder.DropColumn(
                name: "LastFetchedAt",
                table: "AppCurriculumSourceDocuments");

            migrationBuilder.DropColumn(
                name: "SourceKind",
                table: "AppCurriculumSourceDocuments");

            migrationBuilder.DropColumn(
                name: "SourceUrl",
                table: "AppCurriculumSourceDocuments");

            migrationBuilder.DropColumn(
                name: "DownloadedContentType",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "DownloadedFileSize",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "ProcessingStage",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.DropColumn(
                name: "SourceUrlSnapshot",
                table: "AppCurriculumExtractionJobs");

            migrationBuilder.AlterColumn<long>(
                name: "FileSize",
                table: "AppCurriculumSourceDocuments",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FilePath",
                table: "AppCurriculumSourceDocuments",
                type: "character varying(512)",
                maxLength: 512,
                nullable: false,
                defaultValue: "");
        }
    }
}
