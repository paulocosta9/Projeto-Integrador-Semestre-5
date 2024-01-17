import { Service, Inject } from 'typedi';

import IRotaRepo from "../services/IRepos/IRotaRepo";
import { Rota } from "../domain/rota";
import { RotaId } from "../domain/rotaId";
import { RotaMap } from "../mappers/RotaMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IRotaPersistence } from '../dataschema/IRotaPersistence';

@Service()
export default class RotaRepo implements IRotaRepo {
  private models: any;

  constructor(
    @Inject('rotaSchema') private rotaSchema: Model<IRotaPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(rota: Rota): Promise<boolean> {

    const idX = rota.id instanceof RotaId ? (<RotaId>rota.id).toValue() : rota.id;

    const query = { domainId: idX };
    const rotaDocument = await this.rotaSchema.findOne(query as FilterQuery<IRotaPersistence & Document>);

    return !!rotaDocument === true;
  }

  public async save(rota: Rota): Promise<Rota> {
    const query = { domainId: rota.id.toString() };

    const rotaDocument = await this.rotaSchema.findOne(query);

    try {
      if (rotaDocument === null) {
        const rawRota: any = RotaMap.toPersistence(rota);

        const rotaCreated = await this.rotaSchema.create(rawRota);

        return RotaMap.toDomain(rotaCreated);
      } else {
        rotaDocument.armazemInicial = rota.armazemInicial;
        rotaDocument.armazemFinal = rota.armazemFinal;
        rotaDocument.duracao = rota.duracao;
        rotaDocument.energiaGasta = rota.energiaGasta;
        rotaDocument.distancia = rota.distancia;
        rotaDocument.tempExtra = rota.tempExtra;
        await rotaDocument.save();

        return rota;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(rotaId: RotaId | string): Promise<Rota> {
    const query = { domainId: rotaId };
    const rotaRecord = await this.rotaSchema.findOne(query as FilterQuery<IRotaPersistence & Document>);

    if (rotaRecord != null) {
      return RotaMap.toDomain(rotaRecord);
    }
    else
      return null;
  }

  public async findAll(): Promise<Rota[]> {
    const rotaRecord = await this.rotaSchema.find();

    if (rotaRecord != null) {
      var rotaArray = [];
      for (let index = 0; index < rotaRecord.length; ++index) {
        rotaArray[index] = RotaMap.toDomain(rotaRecord[index]);
      }
      return rotaArray;
    }
    else
      return null;
  }

  public async findAllArmazemInicial(inicio: string): Promise<Rota[]> {
    const query = { armazemInicial: inicio };
    const rotaRecord = await this.rotaSchema.find(query as FilterQuery<IRotaPersistence & Document>);

    if (rotaRecord != null) {
      var rotaArray = [];
      for (let index = 0; index < rotaRecord.length; ++index) {
        rotaArray[index] = RotaMap.toDomain(rotaRecord[index]);
      }
      return rotaArray;
    }
    else
      return null;
  }

  public async findAllArmazemFinal(final: string): Promise<Rota[]> {
    const query = { armazemFinal: final };
    const rotaRecord = await this.rotaSchema.find(query as FilterQuery<IRotaPersistence & Document>);

    if (rotaRecord != null) {
      var rotaArray = [];
      for (let index = 0; index < rotaRecord.length; ++index) {
        rotaArray[index] = RotaMap.toDomain(rotaRecord[index]);
      }
      return rotaArray;
    }
    else
      return null;
  }

  public async findAllArmazemInicialFinal(inicio: string, final: string): Promise<Rota[]> {
    const query = { armazemInicial: inicio, armazemFinal: final };
    const rotaRecord = await this.rotaSchema.find(query as FilterQuery<IRotaPersistence & Document>);

    if (rotaRecord != null) {
      var rotaArray = [];
      for (let index = 0; index < rotaRecord.length; ++index) {
        rotaArray[index] = RotaMap.toDomain(rotaRecord[index]);
      }
      return rotaArray;
    }
    else
      return null;
  }

  public async delete(rotaId: RotaId | string): Promise<Rota> {
    const query = { domainId: rotaId };
    const rotaRecord = await this.rotaSchema.findOneAndDelete(query as FilterQuery<IRotaPersistence & Document>);

    if (rotaRecord != null) {
      return RotaMap.toDomain(rotaRecord);
    }
    else
      return null;
  }
}