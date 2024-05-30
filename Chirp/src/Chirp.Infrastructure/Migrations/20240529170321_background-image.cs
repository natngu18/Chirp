using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chirp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class backgroundimage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBackground",
                table: "Medias",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBackground",
                table: "Medias");
        }
    }
}
