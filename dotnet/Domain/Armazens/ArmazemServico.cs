using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using Microsoft.AspNetCore.JsonPatch;

namespace DDDSample1.Domain.Armazens
{
    public class ArmazemServico
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IArmazemRepositorio _repo;

        public ArmazemServico(IUnitOfWork unitOfWork, IArmazemRepositorio repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<ArmazemDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<ArmazemDto> listDto = list.ConvertAll<ArmazemDto>(arm => ArmazemMapper.toDTO(arm));

            return listDto;
        }

        public async Task<ArmazemDto> GetByIdAsync(ArmazemId id)
        {
            var arm = await this._repo.GetByIdAsync(id);

            if (arm == null)
                return null;

            return ArmazemMapper.toDTO(arm);
        }

        public async Task<ArmazemDto> AddAsync(ArmazemDto dto)
        {
            var armazem = ArmazemMapper.toDomain(dto);

            await this._repo.AddAsync(armazem);

            await this._unitOfWork.CommitAsync();

            return ArmazemMapper.toDTO(armazem);
        }

        public async Task<ArmazemDto> UpdateAsync(ArmazemDto dto)
        {
            var armazem = await this._repo.GetByIdAsync(new ArmazemId(dto.Id));

            if (armazem == null)
                return null;

            // change all field
            armazem.MudarInformacao(dto.designacao, dto.end, dto.coord);

            await this._unitOfWork.CommitAsync();

            return ArmazemMapper.toDTO(armazem);
        }

        public async Task<ArmazemDto> InactivateAsync(ArmazemId id)
        {
            var armazem = await this._repo.GetByIdAsync(id);


            if (armazem == null)
                return null;

            // change all fields
            armazem.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return ArmazemMapper.toDTO(armazem);
        }

        public async Task<ArmazemDto> Patch(ArmazemId id, JsonPatchDocument patchDocument)
        {
            var armazem = await this._repo.GetByIdAsync(id);

            if (armazem == null)
                return null;

            // change field
            patchDocument.ApplyTo(armazem);

            await this._unitOfWork.CommitAsync();

            return ArmazemMapper.toDTO(armazem);
        }

        public async Task<ArmazemDto> DeleteAsync(ArmazemId id)
        {
            var armazem = await this._repo.GetByIdAsync(id);

            if (armazem == null)
                return null;

            if (armazem.Active)
                throw new BusinessRuleValidationException("Não é possível apagar um armazém em funcionamento.");

            this._repo.Remove(armazem);
            await this._unitOfWork.CommitAsync();

            return ArmazemMapper.toDTO(armazem);
        }
    }
}