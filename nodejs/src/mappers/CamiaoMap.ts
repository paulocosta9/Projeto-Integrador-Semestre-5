import { Mapper } from "../core/infra/Mapper";

import { Document, Model } from 'mongoose';
import { ICamiaoPersistence } from '../dataschema/ICamiaoPersistence';

import ICamiaoDTO from "../dto/ICamiaoDTO";
import { Camiao } from "../domain/camiao";

import { UniqueEntityID } from "../core/domain/UniqueEntityID";

export class CamiaoMap extends Mapper<Camiao> {
  
  public static toDTO( camiao: Camiao): ICamiaoDTO {
    return {
        id: camiao.id.toString(),
        nome: camiao.nome,
        matricula: camiao.matricula,
        tara: camiao.tara,
        capacidadeCarga: camiao.capacidadeCarga,
        cargaTotalBat: camiao.cargaTotalBat,
        autonomiaCargaMax : camiao.autonomiaCargaMax,
        tempoCarregamento : camiao.tempoCarregamento,
        ativo: camiao.ativo
    } as ICamiaoDTO;
  }

  public static toDomain (camiao: any | Model<ICamiaoPersistence & Document> ): Camiao {
    const camiaoOrError = Camiao.create(
      camiao,
      new UniqueEntityID(camiao.domainId)
    );

    camiaoOrError.isFailure ? console.log(camiaoOrError.error) : '';

    return camiaoOrError.isSuccess ? camiaoOrError.getValue() : null;
  }

  public static toPersistence (camiao: Camiao): any {
    return {
      domainId: camiao.id.toString(),
      nome: camiao.nome,
      matricula: camiao.matricula,
      tara: camiao.tara,
      capacidadeCarga: camiao.capacidadeCarga,
      cargaTotalBat: camiao.cargaTotalBat,
      autonomiaCargaMax : camiao.autonomiaCargaMax,
      tempoCarregamento : camiao.tempoCarregamento,
      ativo: camiao.ativo
    }
  }
}