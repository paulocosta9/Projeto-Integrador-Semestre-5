import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IRotaPersistence } from '../dataschema/IRotaPersistence';

import IRotaDTO from "../dto/IRotaDTO";
import { Rota } from "../domain/rota";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class RotaMap extends Mapper<Rota> {
  
  public static toDTO( rota: Rota): IRotaDTO {
    return {
      id: rota.id.toString(),
      armazemInicial: rota.armazemInicial,
      armazemFinal: rota.armazemFinal,
      duracao: rota.duracao,
      energiaGasta : rota.energiaGasta,
      distancia : rota.distancia,
      tempExtra : rota.tempExtra
    } as IRotaDTO;
  }

  public static toDomain (rota: any | Model<IRotaPersistence & Document> ): Rota {
    const rotaOrError = Rota.create(
      rota,
      new UniqueEntityID(rota.domainId)
    );

    rotaOrError.isFailure ? console.log(rotaOrError.error) : '';

    return rotaOrError.isSuccess ? rotaOrError.getValue() : null;
  }

  public static toPersistence (rota: Rota): any {
    return {
      domainId: rota.id.toString(),
      armazemInicial: rota.armazemInicial,
      armazemFinal: rota.armazemFinal,
      duracao: rota.duracao,
      energiaGasta : rota.energiaGasta,
      distancia : rota.distancia,
      tempExtra : rota.tempExtra
    }
  }
}