import { Service, Inject } from 'typedi';
import config from "../../config";
import IEmpacotamentoRepo from '../services/IRepos/IEmpacotamentoRepo';
import { Result } from "../core/logic/Result";
import IEmpacotamentoService from './IServices/IEmpacotamentoService';
import IEmpacotamentoDTO from '../dto/IEmpacotamentoDTO';
import { EmpacotamentoMap } from '../mappers/EmpacotamentoMap';
import { Empacotamento } from '../domain/empacotamento';
import { EmpacotamentoPosicao } from '../domain/empacotamentoPosicao';
import IEntregaRepo from './IRepos/IEntregaRepo';

@Service()
export default class EmpacotamentoService implements IEmpacotamentoService {
  constructor(
      @Inject(config.repos.empacotamento.name) private empacotamentoRepo : IEmpacotamentoRepo,
      @Inject(config.repos.entrega.name) private entregaRepo : IEntregaRepo
  ) {}

  public async getEmpacotamento( empacotamentoId: string): Promise<Result<IEmpacotamentoDTO>> {
    try {
      const empacotamento = await this.empacotamentoRepo.findByDomainId(empacotamentoId);

      if (empacotamento === null) {
        return Result.fail<IEmpacotamentoDTO>("Empacotamento não encontrado");
      }
      else {
        const empacotamentoDTOResult = EmpacotamentoMap.toDTO( empacotamento ) as IEmpacotamentoDTO;
        return Result.ok<IEmpacotamentoDTO>( empacotamentoDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async getEmpacotamentos(): Promise<Result<IEmpacotamentoDTO[]>> {
    try {
      const empacotamentos = await this.empacotamentoRepo.findAll();

      if (empacotamentos === null) {
        return Result.fail<IEmpacotamentoDTO[]>('Não existem empacotamentos');
      } else {
        var empacotamentoArrayDTO: Array<IEmpacotamentoDTO> = [];
        for (let index = 0; index < empacotamentos.length; ++index) {
          empacotamentoArrayDTO[index] = EmpacotamentoMap.toDTO(empacotamentos[index]) as IEmpacotamentoDTO;
        }
        return Result.ok<IEmpacotamentoDTO[]>(empacotamentoArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }



  public async createEmpacotamento(empacotamentoDTO: IEmpacotamentoDTO): Promise<Result<IEmpacotamentoDTO>> {
      
    try {

      const empacotamentoOrError = await Empacotamento.create( empacotamentoDTO );
      
      if (empacotamentoOrError.isFailure) {
        return Result.fail<IEmpacotamentoDTO>(empacotamentoOrError.errorValue());
      }

      const empacotamentoResult = empacotamentoOrError.getValue();

      var bool = await this.entregaRepo.exists(empacotamentoResult.entregaId);
    

      if (!bool) {
        return Result.fail<IEmpacotamentoDTO>("entrega não existe!");
      }

      await this.empacotamentoRepo.save(empacotamentoResult);

      const empacotamentoDTOResult = EmpacotamentoMap.toDTO( empacotamentoResult ) as IEmpacotamentoDTO;
      return Result.ok<IEmpacotamentoDTO>( empacotamentoDTOResult )
    } catch (e) {
      throw e;
    }
  }

  public async updateEmpacotamento(empacotamentoDTO: IEmpacotamentoDTO): Promise<Result<IEmpacotamentoDTO>> {
      
    try {
      const empacotamento = await this.empacotamentoRepo.findByDomainId(empacotamentoDTO.id);

      if (empacotamento === null) {
        return Result.fail<IEmpacotamentoDTO>("Empacotamento não encontrado");
      }
      else {
        var bool = await this.entregaRepo.exists(empacotamentoDTO.entregaId);
    
        if (!bool) {
          return Result.fail<IEmpacotamentoDTO>("entrega não existe!");
        }
        
        empacotamento.entregaId = empacotamentoDTO.entregaId;
        const posicao = EmpacotamentoPosicao.create(empacotamentoDTO.posicaoX, empacotamentoDTO.posicaoY, empacotamentoDTO.posicaoZ);
        empacotamento.posicao = posicao.getValue();

        await this.empacotamentoRepo.save(empacotamento);

        const empacotamentoDTOResult = EmpacotamentoMap.toDTO( empacotamento ) as IEmpacotamentoDTO;
        return Result.ok<IEmpacotamentoDTO>( empacotamentoDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

  public async deleteEmpacotamento( empacotamentoId: string): Promise<Result<IEmpacotamentoDTO>> {
    try {
      const empacotamento = await this.empacotamentoRepo.delete(empacotamentoId);

      if (empacotamento === null) {
        return Result.fail<IEmpacotamentoDTO>("Empacotamento não encontrado");
      }
      else {
        const empacotamentoDTOResult = EmpacotamentoMap.toDTO( empacotamento ) as IEmpacotamentoDTO;
        return Result.ok<IEmpacotamentoDTO>( empacotamentoDTOResult )
        }
    } catch (e) {
      throw e;
    }
  }

}
