using Microsoft.EntityFrameworkCore.Migrations;

namespace DDDNetCore.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Armazens",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    designacao = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    end_rua = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    end_cidade = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    end_codigo_postal = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    end_pais = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    end_porta = table.Column<int>(type: "int", nullable: true),
                    coord_latitude = table.Column<float>(type: "real", nullable: true),
                    coord_longitude = table.Column<float>(type: "real", nullable: true),
                    coord_altitude = table.Column<float>(type: "real", nullable: true),
                    Active = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Armazens", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Entregas",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    dataEntrega = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    massaEntrega = table.Column<float>(type: "real", nullable: false),
                    armazemEntrega = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tempoCarregarEntrega = table.Column<float>(type: "real", nullable: false),
                    tempoDescarregarEntrega = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Entregas", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Armazens");

            migrationBuilder.DropTable(
                name: "Entregas");
        }
    }
}
