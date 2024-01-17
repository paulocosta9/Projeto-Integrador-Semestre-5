import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IUtilizadorPersistence } from '../dataschema/IUtilizadorPersistence';


import { Utilizador } from "../domain/utilizador";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import IUtilizadorDTO from "../dto/IUtilizadorDTO";

export class UtilizadorMap extends Mapper<Utilizador> {

  public static toDTO(utilizador: Utilizador): IUtilizadorDTO {
    return {
      id: utilizador.id.toString(),
      primeiroNome: utilizador.primeiroNome,
      ultimoNome: utilizador.ultimoNome,
      email: utilizador.email,
      numeroTelemovel: utilizador.numeroTelemovel,
      cargo: utilizador.cargo,
      ativo: utilizador.ativo
    } as IUtilizadorDTO;
  }

  public static toDomain(utilizador: any | Model<IUtilizadorPersistence & Document>): Utilizador {
    const utilizadorOrError = Utilizador.create(
      utilizador,
      new UniqueEntityID(utilizador.domainId)
    );

    utilizadorOrError.isFailure ? console.log(utilizadorOrError.error) : '';

    return utilizadorOrError.isSuccess ? utilizadorOrError.getValue() : null;
  }

  public static toPersistence(utilizador: Utilizador): any {
    return {
      domainId: utilizador.id.toString(),
      primeiroNome: utilizador.primeiroNome,
      ultimoNome: utilizador.ultimoNome,
      email: utilizador.email,
      numeroTelemovel: utilizador.numeroTelemovel,
      cargo: utilizador.cargo,
      ativo: utilizador.ativo
    }
  }
}