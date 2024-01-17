using DDDSample1.Domain.Entregas;
using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.Armazens;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;




namespace DDDSample1.Infrastructure.Entregas
{
    public class EntregaRepositorio : BaseRepository<Entrega, EntregaId>, IEntregaRepositorio
    {
        
        private DDDSample1DbContext cont;

        public EntregaRepositorio(DDDSample1DbContext context):base(context.Entregas)
        {
            cont = context;
        }

        public async Task<List<Entrega>> GetByArmazemAsync(ArmazemId id)
        {   
            return await cont.Entregas
                .Where(x => id.Equals(x.armazemEntrega)).ToListAsync();
        }

        public async Task<List<Entrega>> GetByDataAsync(string data)
        {   
            return await cont.Entregas
                .Where(x => data.Equals(x.dataEntrega)).ToListAsync();
        }

    }
}