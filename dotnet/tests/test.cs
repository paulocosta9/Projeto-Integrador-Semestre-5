using Xunit;
using DDDSample1.Domain.Armazens;
using DDDSample1.Domain.Entregas;

public class test
{
    [Fact]
    public void toDTO()
    {
        EntregaDTO dto = new EntregaDTO { Id = "123123", dataEntrega = "25-09-2025", massaEntrega = 12, armazemEntrega = "002", tempoCarregarEntrega = 11, tempoDescarregarEntrega = 12 };
        Entrega entrega = new Entrega(dto.Id, dto.dataEntrega, dto.massaEntrega, new ArmazemId(dto.armazemEntrega), dto.tempoCarregarEntrega, dto.tempoDescarregarEntrega);


        Assert.Equal(entrega.dataEntrega.ToString(), EntregaMapper.toDTO(entrega).dataEntrega);

    }

}