using DDDSample1.Domain.Armazens;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Armazens
{
    public class ArmazemRepositorio : BaseRepository<Armazem, ArmazemId>, IArmazemRepositorio
    {
    
        public ArmazemRepositorio(DDDSample1DbContext context):base(context.Armazens)
        {
           
        }


    }
}