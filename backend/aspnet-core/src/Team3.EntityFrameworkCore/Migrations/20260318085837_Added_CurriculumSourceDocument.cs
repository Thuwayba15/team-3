using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class Added_CurriculumSourceDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppCurriculumSourceDocuments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SubjectName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    GradeLevel = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    DocumentType = table.Column<int>(type: "integer", nullable: false),
                    FilePath = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    OriginalFileName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FileSize = table.Column<long>(type: "bigint", nullable: false),
                    ContentType = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: true),
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
                    table.PrimaryKey("PK_AppCurriculumSourceDocuments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppCurriculumExtractionJobs",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SourceDocumentId = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ErrorMessage = table.Column<string>(type: "character varying(1024)", maxLength: 1024, nullable: true),
                    DetectedLayoutFamily = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppCurriculumExtractionJobs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppCurriculumExtractionJobs_AppCurriculumSourceDocuments_So~",
                        column: x => x.SourceDocumentId,
                        principalTable: "AppCurriculumSourceDocuments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppParsedStructureNodes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ExtractionJobId = table.Column<long>(type: "bigint", nullable: false),
                    ParentNodeId = table.Column<long>(type: "bigint", nullable: true),
                    NodeType = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppParsedStructureNodes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppParsedStructureNodes_AppCurriculumExtractionJobs_Extract~",
                        column: x => x.ExtractionJobId,
                        principalTable: "AppCurriculumExtractionJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppParsedStructureNodes_AppParsedStructureNodes_ParentNodeId",
                        column: x => x.ParentNodeId,
                        principalTable: "AppParsedStructureNodes",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "AppTopicDrafts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ExtractionJobId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppTopicDrafts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppTopicDrafts_AppCurriculumExtractionJobs_ExtractionJobId",
                        column: x => x.ExtractionJobId,
                        principalTable: "AppCurriculumExtractionJobs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppLessonDrafts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TopicDraftId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppLessonDrafts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppLessonDrafts_AppTopicDrafts_TopicDraftId",
                        column: x => x.TopicDraftId,
                        principalTable: "AppTopicDrafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppLessonMaterialDrafts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LessonDraftId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Content = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppLessonMaterialDrafts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppLessonMaterialDrafts_AppLessonDrafts_LessonDraftId",
                        column: x => x.LessonDraftId,
                        principalTable: "AppLessonDrafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppQuizDrafts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LessonDraftId = table.Column<long>(type: "bigint", nullable: false),
                    Title = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppQuizDrafts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppQuizDrafts_AppLessonDrafts_LessonDraftId",
                        column: x => x.LessonDraftId,
                        principalTable: "AppLessonDrafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppQuizQuestionDrafts",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuizDraftId = table.Column<long>(type: "bigint", nullable: false),
                    QuestionText = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    OptionA = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    OptionB = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    OptionC = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    OptionD = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CorrectAnswer = table.Column<string>(type: "character varying(1)", maxLength: 1, nullable: false),
                    Explanation = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
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
                    table.PrimaryKey("PK_AppQuizQuestionDrafts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppQuizQuestionDrafts_AppQuizDrafts_QuizDraftId",
                        column: x => x.QuizDraftId,
                        principalTable: "AppQuizDrafts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppTutorProfiles_UserId",
                table: "AppTutorProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppStudentProfiles_UserId",
                table: "AppStudentProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppParentProfiles_UserId",
                table: "AppParentProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppAdminProfiles_UserId",
                table: "AppAdminProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_AppCurriculumExtractionJobs_SourceDocumentId",
                table: "AppCurriculumExtractionJobs",
                column: "SourceDocumentId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLessonDrafts_TopicDraftId",
                table: "AppLessonDrafts",
                column: "TopicDraftId");

            migrationBuilder.CreateIndex(
                name: "IX_AppLessonMaterialDrafts_LessonDraftId",
                table: "AppLessonMaterialDrafts",
                column: "LessonDraftId");

            migrationBuilder.CreateIndex(
                name: "IX_AppParsedStructureNodes_ExtractionJobId",
                table: "AppParsedStructureNodes",
                column: "ExtractionJobId");

            migrationBuilder.CreateIndex(
                name: "IX_AppParsedStructureNodes_ParentNodeId",
                table: "AppParsedStructureNodes",
                column: "ParentNodeId");

            migrationBuilder.CreateIndex(
                name: "IX_AppQuizDrafts_LessonDraftId",
                table: "AppQuizDrafts",
                column: "LessonDraftId");

            migrationBuilder.CreateIndex(
                name: "IX_AppQuizQuestionDrafts_QuizDraftId",
                table: "AppQuizQuestionDrafts",
                column: "QuizDraftId");

            migrationBuilder.CreateIndex(
                name: "IX_AppTopicDrafts_ExtractionJobId",
                table: "AppTopicDrafts",
                column: "ExtractionJobId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppLessonMaterialDrafts");

            migrationBuilder.DropTable(
                name: "AppParsedStructureNodes");

            migrationBuilder.DropTable(
                name: "AppQuizQuestionDrafts");

            migrationBuilder.DropTable(
                name: "AppQuizDrafts");

            migrationBuilder.DropTable(
                name: "AppLessonDrafts");

            migrationBuilder.DropTable(
                name: "AppTopicDrafts");

            migrationBuilder.DropTable(
                name: "AppCurriculumExtractionJobs");

            migrationBuilder.DropTable(
                name: "AppCurriculumSourceDocuments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppTutorProfiles",
                table: "AppTutorProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppTutorProfiles_UserId",
                table: "AppTutorProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppStudentProfiles",
                table: "AppStudentProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppStudentProfiles_UserId",
                table: "AppStudentProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppParentProfiles",
                table: "AppParentProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppParentProfiles_UserId",
                table: "AppParentProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppAdminProfiles",
                table: "AppAdminProfiles");

            migrationBuilder.DropIndex(
                name: "IX_AppAdminProfiles_UserId",
                table: "AppAdminProfiles");

            migrationBuilder.RenameTable(
                name: "AppTutorProfiles",
                newName: "TutorProfiles");

            migrationBuilder.RenameTable(
                name: "AppStudentProfiles",
                newName: "StudentProfiles");

            migrationBuilder.RenameTable(
                name: "AppParentProfiles",
                newName: "ParentProfiles");

            migrationBuilder.RenameTable(
                name: "AppAdminProfiles",
                newName: "AdminProfiles");

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

            migrationBuilder.AddPrimaryKey(
                name: "PK_TutorProfiles",
                table: "TutorProfiles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StudentProfiles",
                table: "StudentProfiles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ParentProfiles",
                table: "ParentProfiles",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AdminProfiles",
                table: "AdminProfiles",
                column: "Id");
        }
    }
}
