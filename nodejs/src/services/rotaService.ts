import { Service, Inject } from 'typedi';
import config from '../../config';
import IRotaDTO from '../dto/IRotaDTO';
import { Rota } from '../domain/rota';
import IRotaRepo from '../services/IRepos/IRotaRepo';
import IRotaService from './IServices/IRotaService';
import { Result } from '../core/logic/Result';
import { RotaMap } from '../mappers/RotaMap';
import IArmazemRepo from './IRepos/IArmazemRepo';

@Service()
export default class RotaService implements IRotaService {
  constructor(
    @Inject(config.repos.rota.name) private rotaRepo: IRotaRepo,
    @Inject(config.repos.armazem.name) private armazemRepo: IArmazemRepo,
  ) {}

  public async getRota(rotaId: string): Promise<Result<IRotaDTO>> {
    try {
      const rota = await this.rotaRepo.findByDomainId(rotaId);

      if (rota === null) {
        return Result.fail<IRotaDTO>('Rota nao encontrada');
      } else {
        const rotaDTOResult = RotaMap.toDTO(rota) as IRotaDTO;
        return Result.ok<IRotaDTO>(rotaDTOResult);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getRotas(): Promise<Result<IRotaDTO[]>> {
    try {
      const rotas = await this.rotaRepo.findAll();

      if (rotas === null) {
        return Result.fail<IRotaDTO[]>('Nao existem rotas');
      } else {
        var rotaArrayDTO: Array<IRotaDTO> = [];
        for (let index = 0; index < rotas.length; ++index) {
          rotaArrayDTO[index] = RotaMap.toDTO(rotas[index]) as IRotaDTO;
        }
        return Result.ok<IRotaDTO[]>(rotaArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getRotasInicial(armazemInicial: string): Promise<Result<IRotaDTO[]>> {
    try {
      const rotas = await this.rotaRepo.findAllArmazemInicial(armazemInicial);

      if (rotas === null) {
        return Result.fail<IRotaDTO[]>('Nao existem rotas');
      } else {
        var rotaArrayDTO: Array<IRotaDTO> = [];
        for (let index = 0; index < rotas.length; ++index) {
          rotaArrayDTO[index] = RotaMap.toDTO(rotas[index]) as IRotaDTO;
        }
        return Result.ok<IRotaDTO[]>(rotaArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getRotasFinal(armazemFinal: string): Promise<Result<IRotaDTO[]>> {
    try {
      const rotas = await this.rotaRepo.findAllArmazemFinal(armazemFinal);

      if (rotas === null) {
        return Result.fail<IRotaDTO[]>('Nao existem rotas');
      } else {
        var rotaArrayDTO: Array<IRotaDTO> = [];
        for (let index = 0; index < rotas.length; ++index) {
          rotaArrayDTO[index] = RotaMap.toDTO(rotas[index]) as IRotaDTO;
        }
        return Result.ok<IRotaDTO[]>(rotaArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getRotasInicialFinal(armazemInicial: string, armazemFinal: string): Promise<Result<IRotaDTO[]>> {
    try {
      const rotas = await this.rotaRepo.findAllArmazemInicialFinal(armazemInicial, armazemFinal);

      if (rotas === null) {
        return Result.fail<IRotaDTO[]>('Nao existem rotas');
      } else {
        var rotaArrayDTO: Array<IRotaDTO> = [];
        for (let index = 0; index < rotas.length; ++index) {
          rotaArrayDTO[index] = RotaMap.toDTO(rotas[index]) as IRotaDTO;
        }
        return Result.ok<IRotaDTO[]>(rotaArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async createRota(rotaDTO: IRotaDTO): Promise<Result<IRotaDTO>> {
    try {
      const rotaOrError = await Rota.create(rotaDTO);

      if (rotaOrError.isFailure) {
        return Result.fail<IRotaDTO>(rotaOrError.errorValue());
      }

      const rotaResult = rotaOrError.getValue();

      var bool = await this.armazemRepo.exists(rotaResult.armazemFinal);

      if (!bool) {
        return Result.fail<IRotaDTO>('Armazem Final não existe!');
      }

      var bool2 = await this.armazemRepo.exists(rotaResult.armazemInicial);

      if (!bool2) {
        return Result.fail<IRotaDTO>('Armazem Inicial não existe!');
      }

      await this.rotaRepo.save(rotaResult);

      const rotaDTOResult = RotaMap.toDTO(rotaResult) as IRotaDTO;
      return Result.ok<IRotaDTO>(rotaDTOResult);
    } catch (e) {
      throw e;
    }
  }

  public async updateRota(rotaDTO: IRotaDTO): Promise<Result<IRotaDTO>> {
    try {
      const rota = await this.rotaRepo.findByDomainId(rotaDTO.id);

      const rotaOrError = await Rota.create(rotaDTO);

      if (rotaOrError.isFailure) {
        return Result.fail<IRotaDTO>(rotaOrError.errorValue());
      }

      const rotaResult = rotaOrError.getValue();

      var bool = await this.armazemRepo.exists(rotaResult.armazemFinal);

      if (!bool) {
        return Result.fail<IRotaDTO>('Armazem Final não existe!');
      } else {
        var bool2 = await this.armazemRepo.exists(rotaResult.armazemInicial);

        if (!bool2) {
          return Result.fail<IRotaDTO>('Armazem Inicial não existe!');
        } else {
          if (rota === null) {
            return Result.fail<IRotaDTO>('[!] Rota não encontrada [!]');
          } else {
              (rota.armazemInicial = rotaDTO.armazemInicial),
              (rota.armazemFinal = rotaDTO.armazemFinal),
              (rota.duracao = rotaDTO.duracao),
              (rota.energiaGasta = rotaDTO.energiaGasta),
              (rota.distancia = rotaDTO.distancia);
              (rota.tempExtra=rotaDTO.tempExtra)
            await this.rotaRepo.save(rota);

            const rotaDTOResult = RotaMap.toDTO(rota) as IRotaDTO;
            return Result.ok<IRotaDTO>(rotaDTOResult);
          }
        }
      }
    } catch (e) {
      throw e;
    }
  }

  public async deleteRota( rotaId: string): Promise<Result<IRotaDTO>> {
    try {
      const rota = await this.rotaRepo.delete(rotaId);

      if (rota === null) {
        return Result.fail<IRotaDTO>("Rota nao encontrada");
      }
      else {
        const rotaDTOResult = RotaMap.toDTO( rota ) as IRotaDTO;
        return Result.ok<IRotaDTO>( rotaDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }
}
