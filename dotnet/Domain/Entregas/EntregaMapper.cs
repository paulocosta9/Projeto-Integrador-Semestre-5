
 using DDDSample1.Domain.Armazens;

namespace DDDSample1.Domain.Entregas
{
    public class EntregaMapper{

        public static EntregaDTO toDTO(Entrega entrega){
            return new EntregaDTO { Id = entrega.Id.AsString(), dataEntrega = entrega.dataEntrega, massaEntrega = entrega.massaEntrega, armazemEntrega = entrega.armazemEntrega.AsString(), tempoCarregarEntrega = entrega.tempoCarregarEntrega, tempoDescarregarEntrega = entrega.tempoDescarregarEntrega };
        }

        public static Entrega toDomain(EntregaDTO dto){
            return new Entrega(dto.Id, dto.dataEntrega, dto.massaEntrega, new ArmazemId(dto.armazemEntrega), dto.tempoCarregarEntrega, dto.tempoDescarregarEntrega);
        }
    }
    
}