using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Travelist.Migrations
{
    /// <inheritdoc />
    public partial class AddLikes_UpdateUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Location_Latitude",
                table: "TravelEntities",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Location_Longitude",
                table: "TravelEntities",
                type: "float",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "TravelEntityLikes",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TravelEntityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TravelEntityLikes", x => new { x.UserId, x.TravelEntityId });
                    table.ForeignKey(
                        name: "FK_TravelEntityLikes_TravelEntities_TravelEntityId",
                        column: x => x.TravelEntityId,
                        principalTable: "TravelEntities",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_TravelEntityLikes_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_TravelEntityLikes_TravelEntityId",
                table: "TravelEntityLikes",
                column: "TravelEntityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TravelEntityLikes");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Location_Latitude",
                table: "TravelEntities");

            migrationBuilder.DropColumn(
                name: "Location_Longitude",
                table: "TravelEntities");
        }
    }
}
