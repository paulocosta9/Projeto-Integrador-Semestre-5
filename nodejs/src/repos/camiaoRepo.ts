import { Service, Inject } from 'typedi';

import ICamiaoRepo from "../services/IRepos/ICamiaoRepo";
import { Camiao } from "../domain/camiao";
import { CamiaoId } from "../domain/camiaoId";
import { CamiaoMap } from "../mappers/CamiaoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { ICamiaoPersistence } from '../dataschema/ICamiaoPersistence';


@Service()
export default class CamiaoRepo implements ICamiaoRepo {
  private models: any;

  constructor(
    @Inject('camiaoSchema') private camiaoSchema: Model<ICamiaoPersistence & Document>,
  ) { }

  private createBaseQuery(): any {
    return {
      where: {},
    }
  }

  public async exists(camiao: Camiao): Promise<boolean> {

    const idX = camiao.id instanceof CamiaoId ? (<CamiaoId>camiao.id).toValue() : camiao.id;

    const query = { domainId: idX };
    const camiaoDocument = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

    return !!camiaoDocument === true;
  }

  public async save(camiao: Camiao): Promise<Camiao> {
    const query = { domainId: camiao.id.toString() };

    const camiaoDocument = await this.camiaoSchema.findOne(query);

    try {
      if (camiaoDocument === null) {
        const rawCamiao: any = CamiaoMap.toPersistence(camiao);

        const camiaoCreated = await this.camiaoSchema.create(rawCamiao);

        return CamiaoMap.toDomain(camiaoCreated);
      } else {
        camiaoDocument.nome = camiao.nome;
        camiaoDocument.matricula = camiao.matricula;
        camiaoDocument.tara = camiao.tara;
        camiaoDocument.capacidadeCarga = camiao.capacidadeCarga;
        camiaoDocument.cargaTotalBat = camiao.cargaTotalBat;
        camiaoDocument.autonomiaCargaMax = camiao.autonomiaCargaMax;
        camiaoDocument.tempoCarregamento = camiao.tempoCarregamento;
        camiaoDocument.ativo = camiao.ativo;
        await camiaoDocument.save();

        return camiao;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId(camiaoId: CamiaoId | string): Promise<Camiao> {


    const query = { domainId: camiaoId };
    const camiaoRecord = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

    if (camiaoRecord != null) {
      return CamiaoMap.toDomain(camiaoRecord);
    }
    else
      return null;


  }

  public async findByMatricula(matriculaString: string | String): Promise<Camiao> {

    const query = { matricula: matriculaString };
    const camiaoRecord = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

    if (camiaoRecord != null) {
      return CamiaoMap.toDomain(camiaoRecord);
    }
    else
      return null;


  }

  public async findByNome(nomeString: string | String): Promise<Camiao> {

    const query = { nome: nomeString };
    const camiaoRecord = await this.camiaoSchema.findOne(query as FilterQuery<ICamiaoPersistence & Document>);

    if (camiaoRecord != null) {
      return CamiaoMap.toDomain(camiaoRecord);
    }
    else
      return null;


  }

  public async findAll(): Promise<Camiao[]> {
    const camiaoRecord = await this.camiaoSchema.find();

    if (camiaoRecord != null) {
      var camiaoArray = [];
      for (let index = 0; index < camiaoRecord.length; ++index) {
        camiaoArray[index] = CamiaoMap.toDomain(camiaoRecord[index]);

      }
      return camiaoArray;
    }
    else
      return null;
  }

  public async delete(camiaoId: CamiaoId | string): Promise<Camiao> {
    const query = { domainId: camiaoId };
    const camiaoRecord = await this.camiaoSchema.findOneAndDelete(query as FilterQuery<ICamiaoPersistence & Document>);

    if (camiaoRecord != null) {
      return CamiaoMap.toDomain(camiaoRecord);
    }
    else
      return null;
  }
}