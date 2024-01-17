import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { IPercursoPersistence } from '../dataschema/IPercursoPersistence';

import IEntregaPercursoDTO from "../dto/IEntregaPercursoDTO";
import { EntregaPercurso } from "../domain/entregaPercurso";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class EntregaPercursoMap extends Mapper<EntregaPercurso> {
  
  public static toDTO( entregaPercurso: EntregaPercurso): IEntregaPercursoDTO {
    return {
        armazemId: entregaPercurso.armazemEntrega,
        entrega: entregaPercurso.entrega,
    } as IEntregaPercursoDTO;
  }

  public static toDomain (entregaPercurso: any | Model<IPercursoPersistence & Document> ): EntregaPercurso {

    const entregaPercursoOrError = EntregaPercurso.create(
        entregaPercurso.armazemId,entregaPercurso.entrega,
      new UniqueEntityID(entregaPercurso.domainId)
    );

    entregaPercursoOrError.isFailure ? console.log(entregaPercursoOrError.error) : '';
    return entregaPercursoOrError.isSuccess ? entregaPercursoOrError.getValue() : null;
  }

  public static toPersistence (entregaPercurso: EntregaPercurso): any {
    return {
      domainId: entregaPercurso.id.toString(),
      armazemId: entregaPercurso.armazemEntrega,
      entrega: entregaPercurso.entrega,
    }
  }
}