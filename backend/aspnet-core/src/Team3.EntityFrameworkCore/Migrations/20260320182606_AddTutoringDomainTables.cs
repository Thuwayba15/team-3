using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class AddTutoringDomainTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StudentTutorLinks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentUserId = table.Column<long>(type: "bigint", nullable: false),
                    TutorUserId = table.Column<long>(type: "bigint", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    LinkedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
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
                    table.PrimaryKey("PK_StudentTutorLinks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentTutorLinks_AbpUsers_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentTutorLinks_AbpUsers_TutorUserId",
                        column: x => x.TutorUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentTutorLinks_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StudentTutorRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentUserId = table.Column<long>(type: "bigint", nullable: false),
                    TutorUserId = table.Column<long>(type: "bigint", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StudentMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    ResponseMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    RespondedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_StudentTutorRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentTutorRequests_AbpUsers_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentTutorRequests_AbpUsers_TutorUserId",
                        column: x => x.TutorUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_StudentTutorRequests_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorSubjectAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TutorUserId = table.Column<long>(type: "bigint", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Bio = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    Specialization = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
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
                    table.PrimaryKey("PK_TutorSubjectAssignments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorSubjectAssignments_AbpUsers_TutorUserId",
                        column: x => x.TutorUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TutorSubjectAssignments_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorMeetingRequests",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentTutorLinkId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentUserId = table.Column<long>(type: "bigint", nullable: false),
                    TutorUserId = table.Column<long>(type: "bigint", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    ScheduledStartUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    DurationMinutes = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StudentMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    TutorResponseMessage = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    RespondedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_TutorMeetingRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorMeetingRequests_AbpUsers_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TutorMeetingRequests_AbpUsers_TutorUserId",
                        column: x => x.TutorUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TutorMeetingRequests_StudentTutorLinks_StudentTutorLinkId",
                        column: x => x.StudentTutorLinkId,
                        principalTable: "StudentTutorLinks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TutorMeetingRequests_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorMeetingSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    MeetingRequestId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentUserId = table.Column<long>(type: "bigint", nullable: false),
                    TutorUserId = table.Column<long>(type: "bigint", nullable: false),
                    SubjectId = table.Column<Guid>(type: "uuid", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    StartedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
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
                    table.PrimaryKey("PK_TutorMeetingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorMeetingSessions_AbpUsers_StudentUserId",
                        column: x => x.StudentUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TutorMeetingSessions_AbpUsers_TutorUserId",
                        column: x => x.TutorUserId,
                        principalTable: "AbpUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_TutorMeetingSessions_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TutorMeetingSessions_TutorMeetingRequests_MeetingRequestId",
                        column: x => x.MeetingRequestId,
                        principalTable: "TutorMeetingRequests",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorLinks_StudentUserId_SubjectId_IsActive",
                table: "StudentTutorLinks",
                columns: new[] { "StudentUserId", "SubjectId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorLinks_StudentUserId_TutorUserId_SubjectId_IsAct~",
                table: "StudentTutorLinks",
                columns: new[] { "StudentUserId", "TutorUserId", "SubjectId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorLinks_SubjectId",
                table: "StudentTutorLinks",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorLinks_TutorUserId",
                table: "StudentTutorLinks",
                column: "TutorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorRequests_StudentUserId_TutorUserId_SubjectId_St~",
                table: "StudentTutorRequests",
                columns: new[] { "StudentUserId", "TutorUserId", "SubjectId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorRequests_SubjectId",
                table: "StudentTutorRequests",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentTutorRequests_TutorUserId",
                table: "StudentTutorRequests",
                column: "TutorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingRequests_StudentTutorLinkId_Status",
                table: "TutorMeetingRequests",
                columns: new[] { "StudentTutorLinkId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingRequests_StudentUserId",
                table: "TutorMeetingRequests",
                column: "StudentUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingRequests_SubjectId",
                table: "TutorMeetingRequests",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingRequests_TutorUserId",
                table: "TutorMeetingRequests",
                column: "TutorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingSessions_MeetingRequestId",
                table: "TutorMeetingSessions",
                column: "MeetingRequestId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingSessions_StudentUserId",
                table: "TutorMeetingSessions",
                column: "StudentUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingSessions_SubjectId",
                table: "TutorMeetingSessions",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorMeetingSessions_TutorUserId",
                table: "TutorMeetingSessions",
                column: "TutorUserId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjectAssignments_SubjectId",
                table: "TutorSubjectAssignments",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjectAssignments_TutorUserId",
                table: "TutorSubjectAssignments",
                column: "TutorUserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TutorSubjectAssignments_TutorUserId_SubjectId",
                table: "TutorSubjectAssignments",
                columns: new[] { "TutorUserId", "SubjectId" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StudentTutorRequests");

            migrationBuilder.DropTable(
                name: "TutorMeetingSessions");

            migrationBuilder.DropTable(
                name: "TutorSubjectAssignments");

            migrationBuilder.DropTable(
                name: "TutorMeetingRequests");

            migrationBuilder.DropTable(
                name: "StudentTutorLinks");
        }
    }
}
