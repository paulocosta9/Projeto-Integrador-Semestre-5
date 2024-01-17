import { response } from 'express';
import config from '../../config';
import { Service, Inject } from 'typedi';
import { Result } from '../core/logic/Result';

import IEntregaPercursoRepo from '../services/IRepos/IEntregaPercursoRepo';
import { EntregaPercurso } from "../domain/entregaPercurso";
import { PercursoId } from "../domain/percursoId";
import { EntregaPercursoMap } from "../mappers/EntregaPercursoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPercursoPersistence } from '../dataschema/IPercursoPersistence';
import { IEntregaPercursoPersistence } from '../dataschema/IEntregaPercursoPersistence';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';


@Service()
export default class EntregaPercursoRepo implements IEntregaPercursoRepo {

  private models: any;

  constructor(
    @Inject('entregaPercursoSchema') private entregaPercursoSchema: Model<IEntregaPercursoPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(entregaPercurso: EntregaPercurso): Promise<boolean> {

    const idX = entregaPercurso.id;

    const query = { domainId: idX };
    const percursoDocument = await this.entregaPercursoSchema.findOne(query as FilterQuery<IEntregaPercursoPersistence & Document>);

    return !!percursoDocument === true;
  }

  public async save(entregaPercurso: EntregaPercurso): Promise<EntregaPercurso> {
    const query = { domainId: entregaPercurso.id.toString() };
    const entregaPercursoDocument = await this.entregaPercursoSchema.findOne(query);

    try {
      if (entregaPercursoDocument === null) {
        const rawPercurso: any = EntregaPercursoMap.toPersistence(entregaPercurso);

        const percursoCreated = await this.entregaPercursoSchema.create(rawPercurso);

        return EntregaPercursoMap.toDomain(percursoCreated);
      } else {
        entregaPercursoDocument.armazemId = entregaPercurso.armazemEntrega;
        entregaPercursoDocument.entregaId = entregaPercurso.entrega;
        await entregaPercursoDocument.save();

        return entregaPercurso;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findUIDByDomainId(entregaPercurso: EntregaPercurso): Promise<UniqueEntityID> {
    const query = { domainId: entregaPercurso.id };
    const rotaRecord = await this.entregaPercursoSchema.findOne(query as FilterQuery<IEntregaPercursoPersistence & Document>);
    console.log(rotaRecord.id)
    if (rotaRecord != null) {
      return rotaRecord.id;
    }
    else
      return null;
  }

  public async findDomainByObjectId(id: UniqueEntityID): Promise<EntregaPercurso> {
    const query = { _id: id };
    const rotaRecord = await this.entregaPercursoSchema.findOne(query as FilterQuery<IEntregaPercursoPersistence & Document>);
    console.log(rotaRecord)
    if (rotaRecord != null) {
      return EntregaPercursoMap.toDomain(rotaRecord)
    }
    else
      return null;
  }


}

