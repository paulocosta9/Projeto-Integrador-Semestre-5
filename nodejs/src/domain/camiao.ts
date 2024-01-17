import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { CamiaoId } from "./camiaoId";

import ICamiaoDTO from "../dto/ICamiaoDTO";

interface CamiaoProps {
    nome: string;
    matricula: string;
    tara: number;
    capacidadeCarga: number;
    cargaTotalBat: number;
    autonomiaCargaMax: number;
    tempoCarregamento: number;
    ativo: boolean;
}


export class Camiao extends AggregateRoot<CamiaoProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get CamiaoId(): CamiaoId {
        return new CamiaoId(this.CamiaoId.toValue());
    }

    get nome(): string {
        return this.props.nome;
    }

    set nome(value: string) {
        this.props.nome = value;
    }

    get matricula(): string {
        return this.props.matricula;
    }

    set matricula(value: string) {
        this.props.matricula = value;
    }

    get tara(): number {
        return this.props.tara;
    }

    set tara(value: number) {
        this.props.tara = value;
    }

    get capacidadeCarga(): number {
        return this.props.capacidadeCarga;
    }

    set capacidadeCarga(value: number) {
        this.props.capacidadeCarga = value;
    }

    get cargaTotalBat(): number {
        return this.props.cargaTotalBat;
    }

    set cargaTotalBat(value: number) {
        this.props.cargaTotalBat = value;
    }

    get autonomiaCargaMax(): number {
        return this.props.autonomiaCargaMax;
    }

    set autonomiaCargaMax(value: number) {
        this.props.autonomiaCargaMax = value;
    }

    get tempoCarregamento(): number {
        return this.props.tempoCarregamento;
    }

    set tempoCarregamento(value: number) {
        this.props.tempoCarregamento = value;
    }

    get ativo(): boolean {
        return this.props.ativo;
    }

    set ativo(value: boolean) {
        this.props.ativo = value;
    }


    private constructor(props: CamiaoProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(camiaoDTO: ICamiaoDTO, id?: UniqueEntityID): Result<Camiao> {
        const nome = camiaoDTO.nome;
        const matricula = camiaoDTO.matricula;
        const tara = camiaoDTO.tara;
        const capacidadeCarga = camiaoDTO.capacidadeCarga;
        const cargaTotalBat = camiaoDTO.cargaTotalBat;
        const autonomiaCargaMax = camiaoDTO.autonomiaCargaMax;
        const tempoCarregamento = camiaoDTO.tempoCarregamento;
        const ativo = camiaoDTO.ativo;

        if (!!nome === false || !!matricula === false || matricula.length === 0 || !!tara === false || !!capacidadeCarga === false || !!cargaTotalBat === false || !!autonomiaCargaMax === false || !!tempoCarregamento === false) {

            return Result.fail<Camiao>('Introduza todos os dados');

        }
        if (tara < 0 || capacidadeCarga < 0 || cargaTotalBat < 0 || autonomiaCargaMax < 0 || tempoCarregamento < 0) {

            return Result.fail<Camiao>('Não pode introduzir dados com números negativos');

        }
        if (!VerificarMatricula(matricula)) {

            return Result.fail<Camiao>('Formato de matricula inválido');
        }
        else {

            const camiao = new Camiao({ nome: nome, matricula: matricula, tara: tara, capacidadeCarga: capacidadeCarga, cargaTotalBat: cargaTotalBat, autonomiaCargaMax: autonomiaCargaMax, tempoCarregamento: tempoCarregamento, ativo: ativo }, id);
            return Result.ok<Camiao>(camiao);

        }
    }

}

function VerificarMatricula(matricula: string) {

    var x = /(([0-9]{2}-){2}[A-Z]{2})|([A-Z]{2}(-[0-9]{2}){2})|([A-Z]{2}-[0-9]{2}-[A-Z]{2})|([0-9]{2}-[A-Z]{2}-[0-9]{2})/.test(matricula);
    return x;

}
