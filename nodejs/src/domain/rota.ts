import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { RotaId } from "./rotaId";

import IRotaDTO from "../dto/IRotaDTO";


interface RotaProps {
    armazemInicial: string;
    armazemFinal: string;
    duracao: number;
    energiaGasta : number;
    distancia : number;
    tempExtra : number;
  }


  export class Rota extends AggregateRoot<RotaProps> {
    get id (): UniqueEntityID {
      return this._id;
    }

    get rotaId (): RotaId {
        return new RotaId(this.rotaId.toValue());
      }
  
    get armazemInicial (): string {
      return this.props.armazemInicial;
    }

    set armazemInicial ( value: string) {
        this.props.armazemInicial = value;
    }
  
    get armazemFinal (): string {
      return this.props.armazemFinal;
    }

    set armazemFinal ( value: string) {
        this.props.armazemFinal = value;
    }
    
    get duracao (): number {
        return this.props.duracao;
      }
  
    set duracao ( value: number) {
        this.props.duracao = value;
    }

    get energiaGasta (): number {
        return this.props.energiaGasta;
      }
  
    set energiaGasta ( value: number) {
        this.props.energiaGasta = value;
    }

    get distancia (): number {
        return this.props.distancia;
      }
  
    set distancia ( value: number) {
        this.props.distancia = value;
    }

    get tempExtra (): number {
      return this.props.tempExtra;
    }

  set tempExtra ( value: number) {
      this.props.tempExtra = value;
  }




    private constructor (props: RotaProps, id?: UniqueEntityID) {
      super(props, id);
    }
  
    public static create (rotaDTO: IRotaDTO, id?: UniqueEntityID): Result<Rota> {
      const armazemInicial = rotaDTO.armazemInicial;
      const armazemFinal = rotaDTO.armazemFinal;
      const duracao = rotaDTO.duracao;
      const energiaGasta = rotaDTO.energiaGasta;
      const distancia = rotaDTO.distancia;
      const tempExtra = rotaDTO.tempExtra;
  
      if (!!armazemInicial === false || armazemInicial.length === 0 || !!armazemFinal === false || armazemFinal.length === 0 || !!duracao === false || !!energiaGasta === false || !!distancia === false) {
        return Result.fail<Rota>('Introduza todos os dados')
      }else if(duracao <0 || energiaGasta < 0 || distancia < 0 ||tempExtra<0){
        return Result.fail<Rota>('Introduza valores superiores a 0')
      } 
      else {
        const rota = new Rota({ armazemInicial: armazemInicial,armazemFinal:armazemFinal,duracao:duracao,energiaGasta:energiaGasta,distancia:distancia,tempExtra:tempExtra}, id);
        return Result.ok<Rota>( rota )
      }
    }
  }