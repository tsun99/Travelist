using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Travelist.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLikesAndCommentsForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_TravelEntities_TravelEntityId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelEntityLikes_TravelEntities_TravelEntityId",
                table: "TravelEntityLikes");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_TravelEntities_TravelEntityId",
                table: "Comments",
                column: "TravelEntityId",
                principalTable: "TravelEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TravelEntityLikes_TravelEntities_TravelEntityId",
                table: "TravelEntityLikes",
                column: "TravelEntityId",
                principalTable: "TravelEntities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Comments_TravelEntities_TravelEntityId",
                table: "Comments");

            migrationBuilder.DropForeignKey(
                name: "FK_TravelEntityLikes_TravelEntities_TravelEntityId",
                table: "TravelEntityLikes");

            migrationBuilder.AddForeignKey(
                name: "FK_Comments_TravelEntities_TravelEntityId",
                table: "Comments",
                column: "TravelEntityId",
                principalTable: "TravelEntities",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TravelEntityLikes_TravelEntities_TravelEntityId",
                table: "TravelEntityLikes",
                column: "TravelEntityId",
                principalTable: "TravelEntities",
                principalColumn: "Id");
        }
    }
}
