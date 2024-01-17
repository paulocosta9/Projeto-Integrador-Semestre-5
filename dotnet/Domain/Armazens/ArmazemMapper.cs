
namespace DDDSample1.Domain.Armazens
{
    public class ArmazemMapper{

        public static ArmazemDto toDTO(Armazem armazem){
            return new ArmazemDto { Id = armazem.Id.AsString(), designacao = armazem.designacao,end = armazem.end, coord = armazem.coord, active = armazem.Active };
        }

        public static Armazem toDomain(ArmazemDto dto){
            return new Armazem(dto.Id,dto.designacao,dto.end,dto.coord);
        }
    }
    
}