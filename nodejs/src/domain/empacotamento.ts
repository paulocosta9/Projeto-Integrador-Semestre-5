import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { EmpacotamentoId } from "./empacotamentoId";
import { EmpacotamentoPosicao } from "./empacotamentoPosicao";

import IEmpacotamentoDTO from "../dto/IEmpacotamentoDTO";
import { Guard } from "../core/logic/Guard";

interface EmpacotamentoProps {
    entregaId: string;
    posicao: EmpacotamentoPosicao;
}

export class Empacotamento extends AggregateRoot<EmpacotamentoProps> {
    get id (): UniqueEntityID {
      return this._id;
    }
  
    get empacotamentoId (): EmpacotamentoId {
      return new EmpacotamentoId(this.empacotamentoId.toValue());
    }
  
    get entregaId (): string {
      return this.props.entregaId;
    }
  
    set entregaId ( value: string) {
      this.props.entregaId = value;
    }

    get posicao (): EmpacotamentoPosicao {
      return this.props.posicao;
    }
  
    set posicao ( value: EmpacotamentoPosicao) {
      this.props.posicao = value;
    }


    private constructor (props: EmpacotamentoProps, id?: UniqueEntityID) {
      super(props, id);
    }


    public static create (empacotamentoDTO: IEmpacotamentoDTO, id?: UniqueEntityID): Result<Empacotamento> {
      const entregaId = empacotamentoDTO.entregaId;
      const posicaoX = empacotamentoDTO.posicaoX
      const posicaoY = empacotamentoDTO.posicaoY
      const posicaoZ = empacotamentoDTO.posicaoZ
  
      if (!!entregaId === false || entregaId.length === 0) {
        return Result.fail<Empacotamento>('Must provide a entregaId')
      } else {
        const posicao = EmpacotamentoPosicao.create(posicaoX, posicaoY, posicaoZ);
        const empacotamento = new Empacotamento({ entregaId: entregaId, posicao: posicao.getValue() }, id);
        return Result.ok<Empacotamento>( empacotamento )
      }
    }
    
  

  }
  
