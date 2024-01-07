using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Travelist.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTravelEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TravelEntities",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.CreateIndex(
                name: "IX_TravelEntities_City",
                table: "TravelEntities",
                column: "City");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_TravelEntities_City",
                table: "TravelEntities");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "Name", "PasswordHash", "Username" },
                values: new object[] { 1, "test@test.com", "Namington", "123abc", "test_user" });

            migrationBuilder.InsertData(
                table: "TravelEntities",
                columns: new[] { "Id", "City", "ImageUrl", "Text", "Title", "UserId" },
                values: new object[] { 2, "Kaunas", "", "Sample_Text", "Test", 1 });
        }
    }
}
