using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class AddedLearningMaterialUpload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "SubjectInterests",
                table: "TutorProfiles",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Specialization",
                table: "TutorProfiles",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "TutorProfiles",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "TutorProfiles",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SubjectInterests",
                table: "StudentProfiles",
                type: "character varying(512)",
                maxLength: 512,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProgressLevel",
                table: "StudentProfiles",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "StudentProfiles",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GradeLevel",
                table: "StudentProfiles",
                type: "character varying(32)",
                maxLength: 32,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "RelationshipNotes",
                table: "ParentProfiles",
                type: "character varying(256)",
                maxLength: 256,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "ParentProfiles",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "AdminProfiles",
                type: "character varying(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Department",
                table: "AdminProfiles",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "AppLanguages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    NativeName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLanguages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppSubjects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    GradeLevel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSubjects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppTopics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    DifficultyLevel = table.Column<int>(type: "integer", nullable: false),
                    SequenceOrder = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    MasteryThreshold = table.Column<decimal>(type: "numeric(4,2)", precision: 4, scale: 2, nullable: false, defaultValue: 0.70m),
                    GeneratedByAI = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppTopics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTopics_AppSubjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "AppSubjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppLessons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TopicId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Summary = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    LearningObjective = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    RevisionSummary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    DifficultyLevel = table.Column<int>(type: "integer", nullable: false),
                    EstimatedMinutes = table.Column<int>(type: "integer", nullable: false, defaultValue: 15),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    GeneratedByAI = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeleterUserId = table.Column<long>(type: "bigint", nullable: true),
                    DeletionTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppLessons_AppTopics_TopicId",
                        column: x => x.TopicId,
                        principalTable: "AppTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppLessonMaterials",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    MaterialType = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLessonMaterials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppLessonMaterials_AppLessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "AppLessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppLessonTranslations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    LessonId = table.Column<Guid>(type: "uuid", nullable: false),
                    LanguageId = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Summary = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    Examples = table.Column<string>(type: "text", nullable: true),
                    RevisionSummary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    IsAutoTranslated = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true),
                    LastModificationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    LastModifierUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppLessonTranslations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppLessonTranslations_AppLanguages_LanguageId",
                        column: x => x.LanguageId,
                        principalTable: "AppLanguages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppLessonTranslations_AppLessons_LessonId",
                        column: x => x.LessonId,
                        principalTable: "AppLessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppSourceMaterials",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UploadedByUserId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    FileUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    FileType = table.Column<int>(type: "integer", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ProcessingStatus = table.Column<int>(type: "integer", nullable: false, defaultValue: 1),
                    LanguageId = table.Column<Guid>(type: "uuid", nullable: true),
                    GradeLevel = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    GeneratedLessonId = table.Column<Guid>(type: "uuid", nullable: true),
                    GeneratedTopicId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatorUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppSourceMaterials", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppSourceMaterials_AbpUsers_UploadedByUserId",
                        column: x => x.UploadedByUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppSourceMaterials_AppLanguages_LanguageId",
                        column: x => x.LanguageId,
                        principalTable: "AppLanguages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppSourceMaterials_AppLessons_GeneratedLessonId",
                        column: x => x.GeneratedLessonId,
                        principalTable: "AppLessons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_AppSourceMaterials_AppSubjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "AppSubjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppSourceMaterials_AppTopics_GeneratedTopicId",
                        column: x => x.GeneratedTopicId,
                        principalTable: "AppTopics",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TutorProfiles_UserId",
                table: "TutorProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_StudentProfiles_UserId",
                table: "StudentProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ParentProfiles_UserId",
                table: "ParentProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AdminProfiles_UserId",
                table: "AdminProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppLanguages_Code",
                table: "AppLanguages",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppLessonMaterials_LessonId",
                table: "AppLessonMaterials",
                column: "LessonId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLessons_TopicId",
                table: "AppLessons",
                column: "TopicId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLessonTranslations_LanguageId",
                table: "AppLessonTranslations",
                column: "LanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLessonTranslations_LessonId_LanguageId",
                table: "AppLessonTranslations",
                columns: new[] { "LessonId", "LanguageId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppSourceMaterials_GeneratedLessonId",
                table: "AppSourceMaterials",
                column: "GeneratedLessonId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSourceMaterials_GeneratedTopicId",
                table: "AppSourceMaterials",
                column: "GeneratedTopicId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSourceMaterials_LanguageId",
                table: "AppSourceMaterials",
                column: "LanguageId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSourceMaterials_SubjectId",
                table: "AppSourceMaterials",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSourceMaterials_UploadedByUserId",
                table: "AppSourceMaterials",
                column: "UploadedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_AppSubjects_Name",
                table: "AppSubjects",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppTopics_SubjectId",
                table: "AppTopics",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppLessonMaterials");

            migrationBuilder.DropTable(
                name: "AppLessonTranslations");

            migrationBuilder.DropTable(
                name: "AppSourceMaterials");

            migrationBuilder.DropTable(
                name: "AppLanguages");

            migrationBuilder.DropTable(
                name: "AppLessons");

            migrationBuilder.DropTable(
                name: "AppTopics");

            migrationBuilder.DropTable(
                name: "AppSubjects");

            migrationBuilder.DropIndex(
                name: "IX_TutorProfiles_UserId",
                table: "TutorProfiles");

            migrationBuilder.DropIndex(
                name: "IX_StudentProfiles_UserId",
                table: "StudentProfiles");

            migrationBuilder.DropIndex(
                name: "IX_ParentProfiles_UserId",
                table: "ParentProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AdminProfiles_UserId",
                table: "AdminProfiles");

            migrationBuilder.AlterColumn<string>(
                name: "SubjectInterests",
                table: "TutorProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(512)",
                oldMaxLength: 512,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Specialization",
                table: "TutorProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "TutorProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "Bio",
                table: "TutorProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "SubjectInterests",
                table: "StudentProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(512)",
                oldMaxLength: 512,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "ProgressLevel",
                table: "StudentProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "StudentProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "GradeLevel",
                table: "StudentProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(32)",
                oldMaxLength: 32);

            migrationBuilder.AlterColumn<string>(
                name: "RelationshipNotes",
                table: "ParentProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(256)",
                oldMaxLength: 256,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "ParentProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "PreferredLanguage",
                table: "AdminProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(64)",
                oldMaxLength: 64);

            migrationBuilder.AlterColumn<string>(
                name: "Department",
                table: "AdminProfiles",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(128)",
                oldMaxLength: 128,
                oldNullable: true);
        }
    }
}
