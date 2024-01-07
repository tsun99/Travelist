using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Travelist.Migrations
{
    /// <inheritdoc />
    public partial class AddItemsToPack : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ItemsToPack",
                table: "TravelEntities",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ItemsToPack",
                table: "TravelEntities");
        }
    }
}
