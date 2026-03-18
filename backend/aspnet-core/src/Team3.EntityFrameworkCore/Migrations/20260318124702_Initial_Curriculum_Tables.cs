using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class Initial_Curriculum_Tables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppLessonMaterials_AppLessons_LessonId",
                table: "AppLessonMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_AppLessons_AppTopics_TopicId",
                table: "AppLessons");

            migrationBuilder.DropForeignKey(
                name: "FK_AppLessonTranslations_AppLanguages_LanguageId",
                table: "AppLessonTranslations");

            migrationBuilder.DropForeignKey(
                name: "FK_AppLessonTranslations_AppLessons_LessonId",
                table: "AppLessonTranslations");

            migrationBuilder.DropForeignKey(
                name: "FK_AppSourceMaterials_AbpUsers_UploadedByUserId",
                table: "AppSourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_AppSourceMaterials_AppLanguages_LanguageId",
                table: "AppSourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_AppSourceMaterials_AppLessons_GeneratedLessonId",
                table: "AppSourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_AppSourceMaterials_AppSubjects_SubjectId",
                table: "AppSourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_AppSourceMaterials_AppTopics_GeneratedTopicId",
                table: "AppSourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_AppTopics_AppSubjects_SubjectId",
                table: "AppTopics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppTopics",
                table: "AppTopics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppSubjects",
                table: "AppSubjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppSourceMaterials",
                table: "AppSourceMaterials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppLessonTranslations",
                table: "AppLessonTranslations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppLessons",
                table: "AppLessons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppLessonMaterials",
                table: "AppLessonMaterials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppLanguages",
                table: "AppLanguages");

            migrationBuilder.RenameTable(
                name: "AppTopics",
                newName: "Topics");

            migrationBuilder.RenameTable(
                name: "AppSubjects",
                newName: "Subjects");

            migrationBuilder.RenameTable(
                name: "AppSourceMaterials",
                newName: "SourceMaterials");

            migrationBuilder.RenameTable(
                name: "AppLessonTranslations",
                newName: "LessonTranslations");

            migrationBuilder.RenameTable(
                name: "AppLessons",
                newName: "Lessons");

            migrationBuilder.RenameTable(
                name: "AppLessonMaterials",
                newName: "LessonMaterials");

            migrationBuilder.RenameTable(
                name: "AppLanguages",
                newName: "Languages");

            migrationBuilder.RenameIndex(
                name: "IX_AppTopics_SubjectId",
                table: "Topics",
                newName: "IX_Topics_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_AppSubjects_Name",
                table: "Subjects",
                newName: "IX_Subjects_Name");

            migrationBuilder.RenameIndex(
                name: "IX_AppSourceMaterials_UploadedByUserId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_UploadedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_AppSourceMaterials_SubjectId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_AppSourceMaterials_LanguageId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_LanguageId");

            migrationBuilder.RenameIndex(
                name: "IX_AppSourceMaterials_GeneratedTopicId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_GeneratedTopicId");

            migrationBuilder.RenameIndex(
                name: "IX_AppSourceMaterials_GeneratedLessonId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_GeneratedLessonId");

            migrationBuilder.RenameIndex(
                name: "IX_AppLessonTranslations_LessonId_LanguageId",
                table: "LessonTranslations",
                newName: "IX_LessonTranslations_LessonId_LanguageId");

            migrationBuilder.RenameIndex(
                name: "IX_AppLessonTranslations_LanguageId",
                table: "LessonTranslations",
                newName: "IX_LessonTranslations_LanguageId");

            migrationBuilder.RenameIndex(
                name: "IX_AppLessons_TopicId",
                table: "Lessons",
                newName: "IX_Lessons_TopicId");

            migrationBuilder.RenameIndex(
                name: "IX_AppLessonMaterials_LessonId",
                table: "LessonMaterials",
                newName: "IX_LessonMaterials_LessonId");

            migrationBuilder.RenameIndex(
                name: "IX_AppLanguages_Code",
                table: "Languages",
                newName: "IX_Languages_Code");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Topics",
                table: "Topics",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subjects",
                table: "Subjects",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SourceMaterials",
                table: "SourceMaterials",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LessonTranslations",
                table: "LessonTranslations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Lessons",
                table: "Lessons",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LessonMaterials",
                table: "LessonMaterials",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Languages",
                table: "Languages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_LessonMaterials_Lessons_LessonId",
                table: "LessonMaterials",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lessons_Topics_TopicId",
                table: "Lessons",
                column: "TopicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonTranslations_Languages_LanguageId",
                table: "LessonTranslations",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_LessonTranslations_Lessons_LessonId",
                table: "LessonTranslations",
                column: "LessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_AbpUsers_UploadedByUserId",
                table: "SourceMaterials",
                column: "UploadedByUserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Languages_LanguageId",
                table: "SourceMaterials",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedLessonId",
                table: "SourceMaterials",
                column: "GeneratedLessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Subjects_SubjectId",
                table: "SourceMaterials",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Topics_GeneratedTopicId",
                table: "SourceMaterials",
                column: "GeneratedTopicId",
                principalTable: "Topics",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Topics_Subjects_SubjectId",
                table: "Topics",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LessonMaterials_Lessons_LessonId",
                table: "LessonMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_Lessons_Topics_TopicId",
                table: "Lessons");

            migrationBuilder.DropForeignKey(
                name: "FK_LessonTranslations_Languages_LanguageId",
                table: "LessonTranslations");

            migrationBuilder.DropForeignKey(
                name: "FK_LessonTranslations_Lessons_LessonId",
                table: "LessonTranslations");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_AbpUsers_UploadedByUserId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Languages_LanguageId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Subjects_SubjectId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Topics_GeneratedTopicId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_Topics_Subjects_SubjectId",
                table: "Topics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Topics",
                table: "Topics");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subjects",
                table: "Subjects");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SourceMaterials",
                table: "SourceMaterials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LessonTranslations",
                table: "LessonTranslations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Lessons",
                table: "Lessons");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LessonMaterials",
                table: "LessonMaterials");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Languages",
                table: "Languages");

            migrationBuilder.RenameTable(
                name: "Topics",
                newName: "AppTopics");

            migrationBuilder.RenameTable(
                name: "Subjects",
                newName: "AppSubjects");

            migrationBuilder.RenameTable(
                name: "SourceMaterials",
                newName: "AppSourceMaterials");

            migrationBuilder.RenameTable(
                name: "LessonTranslations",
                newName: "AppLessonTranslations");

            migrationBuilder.RenameTable(
                name: "Lessons",
                newName: "AppLessons");

            migrationBuilder.RenameTable(
                name: "LessonMaterials",
                newName: "AppLessonMaterials");

            migrationBuilder.RenameTable(
                name: "Languages",
                newName: "AppLanguages");

            migrationBuilder.RenameIndex(
                name: "IX_Topics_SubjectId",
                table: "AppTopics",
                newName: "IX_AppTopics_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_Subjects_Name",
                table: "AppSubjects",
                newName: "IX_AppSubjects_Name");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_UploadedByUserId",
                table: "AppSourceMaterials",
                newName: "IX_AppSourceMaterials_UploadedByUserId");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_SubjectId",
                table: "AppSourceMaterials",
                newName: "IX_AppSourceMaterials_SubjectId");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_LanguageId",
                table: "AppSourceMaterials",
                newName: "IX_AppSourceMaterials_LanguageId");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_GeneratedTopicId",
                table: "AppSourceMaterials",
                newName: "IX_AppSourceMaterials_GeneratedTopicId");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_GeneratedLessonId",
                table: "AppSourceMaterials",
                newName: "IX_AppSourceMaterials_GeneratedLessonId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonTranslations_LessonId_LanguageId",
                table: "AppLessonTranslations",
                newName: "IX_AppLessonTranslations_LessonId_LanguageId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonTranslations_LanguageId",
                table: "AppLessonTranslations",
                newName: "IX_AppLessonTranslations_LanguageId");

            migrationBuilder.RenameIndex(
                name: "IX_Lessons_TopicId",
                table: "AppLessons",
                newName: "IX_AppLessons_TopicId");

            migrationBuilder.RenameIndex(
                name: "IX_LessonMaterials_LessonId",
                table: "AppLessonMaterials",
                newName: "IX_AppLessonMaterials_LessonId");

            migrationBuilder.RenameIndex(
                name: "IX_Languages_Code",
                table: "AppLanguages",
                newName: "IX_AppLanguages_Code");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppTopics",
                table: "AppTopics",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppSubjects",
                table: "AppSubjects",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppSourceMaterials",
                table: "AppSourceMaterials",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppLessonTranslations",
                table: "AppLessonTranslations",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppLessons",
                table: "AppLessons",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppLessonMaterials",
                table: "AppLessonMaterials",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppLanguages",
                table: "AppLanguages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AppLessonMaterials_AppLessons_LessonId",
                table: "AppLessonMaterials",
                column: "LessonId",
                principalTable: "AppLessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppLessons_AppTopics_TopicId",
                table: "AppLessons",
                column: "TopicId",
                principalTable: "AppTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppLessonTranslations_AppLanguages_LanguageId",
                table: "AppLessonTranslations",
                column: "LanguageId",
                principalTable: "AppLanguages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AppLessonTranslations_AppLessons_LessonId",
                table: "AppLessonTranslations",
                column: "LessonId",
                principalTable: "AppLessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppSourceMaterials_AbpUsers_UploadedByUserId",
                table: "AppSourceMaterials",
                column: "UploadedByUserId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AppSourceMaterials_AppLanguages_LanguageId",
                table: "AppSourceMaterials",
                column: "LanguageId",
                principalTable: "AppLanguages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AppSourceMaterials_AppLessons_GeneratedLessonId",
                table: "AppSourceMaterials",
                column: "GeneratedLessonId",
                principalTable: "AppLessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AppSourceMaterials_AppSubjects_SubjectId",
                table: "AppSourceMaterials",
                column: "SubjectId",
                principalTable: "AppSubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_AppSourceMaterials_AppTopics_GeneratedTopicId",
                table: "AppSourceMaterials",
                column: "GeneratedTopicId",
                principalTable: "AppTopics",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AppTopics_AppSubjects_SubjectId",
                table: "AppTopics",
                column: "SubjectId",
                principalTable: "AppSubjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
