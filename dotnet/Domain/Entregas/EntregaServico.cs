using System.Threading.Tasks;
using System.Collections.Generic;

using DDDSample1.Domain.Shared;

using DDDSample1.Domain.Armazens;

namespace DDDSample1.Domain.Entregas
{
    public class EntregaServico
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEntregaRepositorio _erepo;
        private readonly IArmazemRepositorio _arepo;

        public EntregaServico(IUnitOfWork unitOfWork, IEntregaRepositorio repoEntrega, IArmazemRepositorio repoArmazem)
        {
            this._unitOfWork = unitOfWork;
            this._erepo = repoEntrega;
            this._arepo = repoArmazem;
        }

        public async Task<List<EntregaDTO>> GetAllAsync()
        {
            var list = await this._erepo.GetAllAsync();

            List<EntregaDTO> listDto = list.ConvertAll<EntregaDTO>(entr => new EntregaDTO { Id = entr.Id.AsString(), dataEntrega = entr.dataEntrega, massaEntrega = entr.massaEntrega, armazemEntrega = entr.armazemEntrega.AsString(), tempoCarregarEntrega = entr.tempoCarregarEntrega, tempoDescarregarEntrega = entr.tempoDescarregarEntrega });

            return listDto;
        }

        public async Task<EntregaDTO> GetByIdAsync(EntregaId id)
        {
            var entrega = await this._erepo.GetByIdAsync(id);

            if (entrega == null)
                return null;

            return EntregaMapper.toDTO(entrega);
        }

        public async Task<List<EntregaDTO>> GetByArmazemAsync(ArmazemId id)
        {
            var list = await this._erepo.GetByArmazemAsync(id);

            List<EntregaDTO> listDto = list.ConvertAll<EntregaDTO>(entr => new EntregaDTO { Id = entr.Id.AsString(), dataEntrega = entr.dataEntrega, massaEntrega = entr.massaEntrega, armazemEntrega = entr.armazemEntrega.AsString(), tempoCarregarEntrega = entr.tempoCarregarEntrega, tempoDescarregarEntrega = entr.tempoDescarregarEntrega });

            return listDto;
        }

         public async Task<List<EntregaDTO>> GetByDataAsync(string data)
        {
            var list = await this._erepo.GetByDataAsync(data);

            List<EntregaDTO> listDto = list.ConvertAll<EntregaDTO>(entr => new EntregaDTO { Id = entr.Id.AsString(), dataEntrega = entr.dataEntrega, massaEntrega = entr.massaEntrega, armazemEntrega = entr.armazemEntrega.AsString(), tempoCarregarEntrega = entr.tempoCarregarEntrega, tempoDescarregarEntrega = entr.tempoDescarregarEntrega });

            return listDto;
        }
        public async Task<EntregaDTO> AddAsync(EntregaDTO dto)
        {
            await VerificarArmazem(dto);

            var entrega = EntregaMapper.toDomain(dto);

            await this._erepo.AddAsync(entrega);

            await this._unitOfWork.CommitAsync();

            return EntregaMapper.toDTO(entrega);
        }


        public async Task<EntregaDTO> UpdateAsync(EntregaDTO dto)
        {

            await VerificarArmazem(dto);

            var entrega = await this._erepo.GetByIdAsync(new EntregaId(dto.Id));

            if (entrega == null)
                return null;

            // change all field
            entrega.MudarInformacao(dto.dataEntrega, dto.massaEntrega, new ArmazemId(dto.armazemEntrega), dto.tempoCarregarEntrega, dto.tempoDescarregarEntrega);

            await this._unitOfWork.CommitAsync();

            return EntregaMapper.toDTO(entrega);
        }

        public async Task<EntregaDTO> DeleteAsync(EntregaId id)
        {
            var entr = await this._erepo.GetByIdAsync(id);

            if (entr == null)
                return null;


            this._erepo.Remove(entr);
            await this._unitOfWork.CommitAsync();

            return EntregaMapper.toDTO(entr);
        }
        public async Task<EntregaDTO> VerificarArmazem(EntregaDTO dto)
        {

            var armazem = await this._arepo.GetByIdAsync(new ArmazemId(dto.armazemEntrega));

            if (armazem == null)
            {

                throw new BusinessRuleValidationException("\n\n[!] Armazém Inválido [!] \nPor favor verifique se inseriu o ID de um Armaém existente\n");
            }
            else
            {

                return dto;
            }
        }


    }
}