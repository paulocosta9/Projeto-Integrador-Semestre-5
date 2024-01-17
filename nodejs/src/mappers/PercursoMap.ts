import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IPercursoPersistence } from '../dataschema/IPercursoPersistence';

import IPercursoResultadoBDDTO from "../dto/IPercursoDTO";
import { Percurso } from "../domain/percurso";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class PercursoMap extends Mapper<Percurso> {
  
  public static toDTO( percurso: Percurso): IPercursoResultadoBDDTO {
    return {
        percurso: percurso.percurso,
        tempo: percurso.tempo,
        entregas: percurso.entregas,
        camiao: percurso.camiao,
        dataPercurso : percurso.dataPercurso
    } as IPercursoResultadoBDDTO;
  }

  public static toDomain (percurso: any | Model<IPercursoPersistence & Document> ): Percurso {
    const percursoOrError = Percurso.create(
      percurso,
      new UniqueEntityID(percurso.domainId)
    );

    percursoOrError.isFailure ? console.log(percursoOrError.error) : '';

    return percursoOrError.isSuccess ? percursoOrError.getValue() : null;
  }

  public static toPersistence (percurso: Percurso): any {
    return {
      domainId: percurso.id.toString(),
      percurso: percurso.percurso,
      tempo: percurso.tempo,
      entregas: percurso.entregas,
      camiao: percurso.camiao,
      dataPercurso: percurso.dataPercurso
    }
  }
}