import { AggregateRoot } from "../core/domain/AggregateRoot";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";

import { Result } from "../core/logic/Result";
import { UtilizadorId } from "./utilizadorId";

import IUtilizadorDTO from "../dto/IUtilizadorDTO";

interface UtilizadorProps {

    primeiroNome: string;
    ultimoNome: string;
    email: string;
    cargo: string;
    numeroTelemovel: string;
    ativo: boolean;
}



export class Utilizador extends AggregateRoot<UtilizadorProps> {
    get id(): UniqueEntityID {
        return this._id;
    }

    get utilizadorId(): UtilizadorId {
        return new UtilizadorId(this.utilizadorId.toValue());
    }

    get primeiroNome(): string {
        return this.props.primeiroNome;
    }

    set primeiroNome(value: string) {
        this.props.primeiroNome = value;
    }

    get ultimoNome(): string {
        return this.props.ultimoNome;
    }

    set ultimoNome(value: string) {
        this.props.ultimoNome = value;
    }

    get email(): string {
        return this.props.email;
    }

    set email(value: string) {
        this.props.email = value;
    }

    get numeroTelemovel(): string {
        return this.props.numeroTelemovel;
    }

    set numeroTelemovel(value: string) {
        this.props.numeroTelemovel = value;
    }

    get cargo(): string {
        return this.props.cargo;
    }

    set cargo(value: string) {
        this.props.cargo = value;
    }

    get ativo(): boolean {
        return this.props.ativo;
    }

    set ativo(value: boolean) {
        this.props.ativo = value;
    }

    private constructor(props: UtilizadorProps, id?: UniqueEntityID) {
        super(props, id);
    }

    public static create(utilizadorDTO: IUtilizadorDTO, id?: UniqueEntityID): Result<Utilizador> {
        const primeiroNome = utilizadorDTO.primeiroNome
        const ultimoNome = utilizadorDTO.ultimoNome
        const email = utilizadorDTO.email
        const numeroTelemovel = utilizadorDTO.numeroTelemovel
        const cargo = utilizadorDTO.cargo
        const ativo = utilizadorDTO.ativo


        if (!!primeiroNome === false || !!ultimoNome === false || primeiroNome.length === 0 || ultimoNome.length === 0 || !!email === false || email.length === 0 || !!cargo === false || cargo.length === 0) {

            return Result.fail<Utilizador>('Introduza todos os dados');

        }
        
        else {

            const utilizador = new Utilizador({ primeiroNome: primeiroNome, ultimoNome: ultimoNome, email: email, numeroTelemovel: numeroTelemovel, cargo: cargo,ativo:ativo }, id);
            return Result.ok<Utilizador>(utilizador);

        }
    }

}

