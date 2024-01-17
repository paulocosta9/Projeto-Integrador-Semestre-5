
using DDDSample1.Domain.Shared;
using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Armazens;



namespace DDDSample1.Domain.Entregas
{
    public interface IEntregaRepositorio: IRepository<Entrega,EntregaId>
    {
        public Task<List<Entrega>> GetByArmazemAsync(ArmazemId id);
        public Task<List<Entrega>> GetByDataAsync(string data);
    }
}