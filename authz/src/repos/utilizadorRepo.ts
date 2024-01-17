import { Service, Inject } from 'typedi';

import IUtilizadorRepo from "../services/IRepos/IUtilizadorRepo";
import { Utilizador } from "../domain/utilizador";
import { UtilizadorId } from "../domain/utilizadorId";
import { UtilizadorMap } from "../mappers/UtilizadorMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IUtilizadorPersistence } from '../dataschema/IUtilizadorPersistence';


@Service()
export default class UtilizadorRepo implements IUtilizadorRepo {
  private models: any;

  constructor(
    @Inject('utilizadorSchema') private utilizadorSchema: Model<IUtilizadorPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(utilizador: Utilizador): Promise<boolean> {

    const idX = utilizador.id instanceof UtilizadorId ? (<UtilizadorId>utilizador.id).toValue() : utilizador.id;

    const query = { domainId: idX };
    const camiaoDocument = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);

    return !!camiaoDocument === true;
  }

  public async save(utilizador: Utilizador): Promise<Utilizador> {
    const query = { domainId: utilizador.id.toString() };

    const camiaoDocument = await this.utilizadorSchema.findOne(query);

    try {
      if (camiaoDocument === null) {
        const rawCamiao: any = UtilizadorMap.toPersistence(utilizador);

        const utilizadorCreated = await this.utilizadorSchema.create(rawCamiao);

        return UtilizadorMap.toDomain(utilizadorCreated);
      } else {
        camiaoDocument.primeiroNome = utilizador.primeiroNome;
        camiaoDocument.ultimoNome = utilizador.ultimoNome;
        camiaoDocument.email = utilizador.email;
        camiaoDocument.numeroTelemovel = utilizador.numeroTelemovel;
        camiaoDocument.cargo = utilizador.cargo;
        camiaoDocument.ativo = utilizador.ativo;

        await camiaoDocument.save();

        return utilizador;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(utilizadorId: UtilizadorId | string): Promise<Utilizador> {


    const query = { domainId: utilizadorId };
    const utilizadorRecord = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);

    if (utilizadorRecord != null) {
      return UtilizadorMap.toDomain(utilizadorRecord);
    }
    else
      return null;


  }

  public async findByEmail(email: string | String): Promise<Utilizador> {

    const query = { email: email };
    const utilizadorRecord = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);

    if (utilizadorRecord != null) {
      return UtilizadorMap.toDomain(utilizadorRecord);
    }
    else
      return null;


  }

  public async findByNumeroTelemovel(numeroTelemovel: string | String): Promise<Utilizador> {

    const query = { numeroTelemovel: numeroTelemovel };
    const utilizadorRecord = await this.utilizadorSchema.findOne(query as FilterQuery<IUtilizadorPersistence & Document>);

    if (utilizadorRecord != null) {
      return UtilizadorMap.toDomain(utilizadorRecord);
    }
    else
      return null;


  }

  public async findAll(): Promise<Utilizador[]> {
    const utilizadorRecord = await this.utilizadorSchema.find();

    if (utilizadorRecord != null) {
      var utilizadorArray = [];
      for (let index = 0; index < utilizadorRecord.length; ++index) {
        utilizadorArray[index] = UtilizadorMap.toDomain(utilizadorRecord[index]);

      }
      return utilizadorArray;
    }
    else
      return null;
  }

  public async delete(utilizadorId: UtilizadorId | string): Promise<Utilizador> {
    const query = { domainId: utilizadorId };
    const utilizadorRecord = await this.utilizadorSchema.findOneAndDelete(query as FilterQuery<IUtilizadorPersistence & Document>);

    if (utilizadorRecord != null) {
      return UtilizadorMap.toDomain(utilizadorRecord);
    }
    else
      return null;
  }
}