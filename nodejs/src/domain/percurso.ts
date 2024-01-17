import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { PercursoId } from "./percursoId";

import IPercursoResultadoBDDTO from "../dto/IPercursoDTO";
import { EntregaPercurso } from "./entregaPercurso";

interface PercursoProps {
    percurso: string;
    tempo: number;
    entregas: UniqueEntityID[];
    camiao: string;
    dataPercurso: string;
}


export class Percurso extends AggregateRoot<PercursoProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get PercursoId(): PercursoId {
        return new PercursoId(this.PercursoId.toValue());
    }

    get percurso(): string {
        return this.props.percurso;
    }

    set percurso(value: string) {
        this.props.percurso = value;
    }

    get tempo(): number {
        return this.props.tempo;
    }

    set tempo(value: number) {
        this.props.tempo = value;
    }

    get camiao(): string {
        return this.props.camiao;
    }

    set camiao(value: string) {
        this.props.camiao = value;
    }

    get entregas(): UniqueEntityID[] {
        return this.props.entregas;
    }

    set entregas(value: UniqueEntityID[]) {
        this.props.entregas = value;
    }

    get dataPercurso(): string {
        return this.props.dataPercurso;
    }

    set dataPercurso(value: string) {
        this.props.dataPercurso = value;
    }

    private constructor(props: PercursoProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(percursoDTO: IPercursoResultadoBDDTO, id?: UniqueEntityID): Result<Percurso> {
        const percurso = percursoDTO.percurso;
        const tempo = percursoDTO.tempo;
        const entregas = percursoDTO.entregas;
        const camiao = percursoDTO.camiao;
        const dataPercurso = percursoDTO.dataPercurso;


        const percursoFinal = new Percurso({ percurso: percurso, tempo: tempo, entregas: entregas,camiao : camiao,dataPercurso:dataPercurso }, id);
        return Result.ok<Percurso>(percursoFinal);


    }

}

