import { Service, Inject } from 'typedi';
import config from "../../config";
import ICamiaoDTO from '../dto/ICamiaoDTO';
import { Camiao } from "../domain/camiao";
import ICamiaoRepo from '../services/IRepos/ICamiaoRepo';
import ICamiaoService from './IServices/ICamiaoService';
import { Result } from "../core/logic/Result";
import { CamiaoMap } from "../mappers/CamiaoMap";
import { Request } from 'express';

@Service()
export default class CamiaoService implements ICamiaoService {
  constructor(
    @Inject(config.repos.camiao.name) private camiaoRepo: ICamiaoRepo
  ) { }
  public async deleteCamiao(camiaoId: string): Promise<Result<ICamiaoDTO>> {
    try {
      const camiao = await this.camiaoRepo.delete(camiaoId);

      if (camiao === null) {
        return Result.fail<ICamiaoDTO>("Camiao nao encontrado");
      }
      else {
        const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;
        return Result.ok<ICamiaoDTO>(camiaoDTOResult)
      }
    } catch (e) {
      throw e;
    }
  }

  public async getCamiao(camiaoId: string): Promise<Result<ICamiaoDTO>> {
    try {
      const camiao = await this.camiaoRepo.findByDomainId(camiaoId);

      if (camiao === null) {
        return Result.fail<ICamiaoDTO>("Camiao nao encontrado");
      }
      else {
        const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;
        return Result.ok<ICamiaoDTO>(camiaoDTOResult)
      }
    } catch (e) {
      throw e;
    }
  }

  public async getCamioes(): Promise<Result<ICamiaoDTO[]>> {
    try {
      const camioes = await this.camiaoRepo.findAll();

      if (camioes === null) {
        return Result.fail<ICamiaoDTO[]>("[!] Não existem Camiões [!]");
      }
      else {

        var rotaArrayDTO: Array<ICamiaoDTO> = [];
        for (let index = 0; index < camioes.length; ++index) {
          rotaArrayDTO[index] = CamiaoMap.toDTO(camioes[index]) as ICamiaoDTO;

        }
        return Result.ok<ICamiaoDTO[]>(rotaArrayDTO)
      }
    } catch (e) {
      throw e;
    }
  }

  public async createCamiao(camiaoDTO: ICamiaoDTO): Promise<Result<ICamiaoDTO>> {
    try {
      camiaoDTO.ativo = true;
      const camiaoOrError = await Camiao.create(camiaoDTO);

      if (camiaoOrError.isFailure) {
        return Result.fail<ICamiaoDTO>(camiaoOrError.errorValue());
      }

      const camiaoResult = camiaoOrError.getValue();

      await this.camiaoRepo.save(camiaoResult);

      const camiaoDTOResult = CamiaoMap.toDTO(camiaoResult) as ICamiaoDTO;
      return Result.ok<ICamiaoDTO>(camiaoDTOResult)
    } catch (e) {
      throw e;
    }
  }

  public async updateCamiao(camiaoDTO: ICamiaoDTO): Promise<Result<ICamiaoDTO>> {
    try {
      const camiao = await this.camiaoRepo.findByDomainId(camiaoDTO.id);

      if (camiao === null) {
        return Result.fail<ICamiaoDTO>("Camiao nao encontrado");
      }
      else {

        camiao.matricula = camiaoDTO.matricula;
        camiao.nome = camiaoDTO.nome;
        camiao.tara = camiaoDTO.tara;
        camiao.capacidadeCarga = camiaoDTO.capacidadeCarga;
        camiao.cargaTotalBat = camiaoDTO.cargaTotalBat;
        camiao.autonomiaCargaMax = camiaoDTO.autonomiaCargaMax;
        camiao.tempoCarregamento = camiaoDTO.tempoCarregamento;
        await this.camiaoRepo.save(camiao);

        const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;
        return Result.ok<ICamiaoDTO>(camiaoDTOResult)
      }
    } catch (e) {
      throw e;
    }
  }

  public async patchCamiao(camiaoMatricula: string, req: Request): Promise<Result<ICamiaoDTO>> {
    try {
      const camiao = await this.camiaoRepo.findByMatricula(camiaoMatricula);

      if (camiao === null) {
        return Result.fail<ICamiaoDTO>("Camiao nao encontrado");
      }
      else {

        Object.assign(camiao,req.body);
        await this.camiaoRepo.save(camiao);

        const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;
        return Result.ok<ICamiaoDTO>(camiaoDTOResult)
      }
    } catch (e) {
      throw e;
    }
  }

  public async getMatricula(matriculaString: string): Promise<Result<ICamiaoDTO>> {

    try {
      const camiao = await this.camiaoRepo.findByMatricula(matriculaString);

      if (camiao === null) {
        return Result.fail<ICamiaoDTO>("Camiao nao encontrado");
      }
      else {
        const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;
        return Result.ok<ICamiaoDTO>(camiaoDTOResult)
      }

    } catch (e) {
      throw e;
    }
  }

  public async getByNome(nomeString: string): Promise<Result<ICamiaoDTO>> {

    try {
      const camiao = await this.camiaoRepo.findByNome(nomeString);

      if (camiao === null) {
        return Result.fail<ICamiaoDTO>("Camiao nao encontrado");
      }
      else {
        const camiaoDTOResult = CamiaoMap.toDTO(camiao) as ICamiaoDTO;
        return Result.ok<ICamiaoDTO>(camiaoDTOResult)
      }

    } catch (e) {
      throw e;
    }
  }

}
