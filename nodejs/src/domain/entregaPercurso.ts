import { ValueObject } from '../core/domain/ValueObject';
import { Result } from '../core/logic/Result';
import { Guard } from '../core/logic/Guard';
import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import IEntregaPercursoDTO from "../dto/IEntregaPercursoDTO";


interface entregaPercursoProps {
    armazemEntrega: number;
    entrega: number;
}

export class EntregaPercurso extends AggregateRoot<entregaPercursoProps> {

    get id(): UniqueEntityID {
        return this._id;
    }

    get armazemEntrega(): number {
        return this.props.armazemEntrega;
    }

    get entrega(): number {
        return this.props.entrega;
    }

    public constructor(props: entregaPercursoProps, id?: UniqueEntityID) {
        super(props,id);
    }

    public static create(armazemId:number, entregaId:number , id?: UniqueEntityID): Result<EntregaPercurso> {
        const armazem = armazemId;
        const listaEntregas = entregaId;

        const entrega = new EntregaPercurso({ armazemEntrega:armazem , entrega:listaEntregas },id);
        return Result.ok<EntregaPercurso>(entrega);
    }

}

