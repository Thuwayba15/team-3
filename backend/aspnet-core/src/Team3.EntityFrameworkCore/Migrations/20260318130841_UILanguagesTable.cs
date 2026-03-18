using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Team3.Migrations
{
    /// <inheritdoc />
    public partial class UILanguagesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppUILanguages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "character varying(16)", maxLength: 16, nullable: false),
                    Name = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    IsDefault = table.Column<bool>(type: "boolean", nullable: false),
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
                    table.PrimaryKey("PK_AppUILanguages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUILanguages_Code",
                table: "AppUILanguages",
                column: "Code",
                unique: true);

            migrationBuilder.InsertData(
                table: "AppUILanguages",
                columns: new[] { "Id", "Code", "Name", "IsActive", "IsDefault", "CreationTime", "CreatorUserId", "LastModificationTime", "LastModifierUserId", "IsDeleted", "DeleterUserId", "DeletionTime" },
                values: new object[,]
                {
                    { 1, "en", "English", true, true, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), null, null, null, false, null, null },
                    { 2, "zu", "isiZulu", true, false, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), null, null, null, false, null, null },
                    { 3, "st", "Sesotho", true, false, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), null, null, null, false, null, null },
                    { 4, "af", "Afrikaans", true, false, new DateTime(2026, 3, 18, 0, 0, 0, DateTimeKind.Utc), null, null, null, false, null, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AppUILanguages",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "AppUILanguages",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "AppUILanguages",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "AppUILanguages",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropTable(
                name: "AppUILanguages");
        }
    }
}
