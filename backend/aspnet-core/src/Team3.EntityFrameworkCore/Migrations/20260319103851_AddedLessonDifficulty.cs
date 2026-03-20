using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class AddedLessonDifficulty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedLessonId",
                table: "SourceMaterials");

            migrationBuilder.RenameColumn(
                name: "GeneratedLessonId",
                table: "SourceMaterials",
                newName: "GeneratedMediumLessonId");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_GeneratedLessonId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_GeneratedMediumLessonId");

            migrationBuilder.AddColumn<Guid>(
                name: "GeneratedEasyLessonId",
                table: "SourceMaterials",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "GeneratedHardLessonId",
                table: "SourceMaterials",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_SourceMaterials_GeneratedEasyLessonId",
                table: "SourceMaterials",
                column: "GeneratedEasyLessonId");

            migrationBuilder.CreateIndex(
                name: "IX_SourceMaterials_GeneratedHardLessonId",
                table: "SourceMaterials",
                column: "GeneratedHardLessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedEasyLessonId",
                table: "SourceMaterials",
                column: "GeneratedEasyLessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedHardLessonId",
                table: "SourceMaterials",
                column: "GeneratedHardLessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedMediumLessonId",
                table: "SourceMaterials",
                column: "GeneratedMediumLessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedEasyLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedHardLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedMediumLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropIndex(
                name: "IX_SourceMaterials_GeneratedEasyLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropIndex(
                name: "IX_SourceMaterials_GeneratedHardLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropColumn(
                name: "GeneratedEasyLessonId",
                table: "SourceMaterials");

            migrationBuilder.DropColumn(
                name: "GeneratedHardLessonId",
                table: "SourceMaterials");

            migrationBuilder.RenameColumn(
                name: "GeneratedMediumLessonId",
                table: "SourceMaterials",
                newName: "GeneratedLessonId");

            migrationBuilder.RenameIndex(
                name: "IX_SourceMaterials_GeneratedMediumLessonId",
                table: "SourceMaterials",
                newName: "IX_SourceMaterials_GeneratedLessonId");

            migrationBuilder.AddForeignKey(
                name: "FK_SourceMaterials_Lessons_GeneratedLessonId",
                table: "SourceMaterials",
                column: "GeneratedLessonId",
                principalTable: "Lessons",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}