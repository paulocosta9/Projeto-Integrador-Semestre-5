import { Mapper } from "../core/infra/Mapper";

import IEmpacotamentoDTO from "../dto/IEmpacotamentoDTO";

import { Empacotamento } from "../domain/empacotamento";
import { UniqueEntityID } from "../core/domain/UniqueEntityID";


import { EmpacotamentoPosicao } from '../domain/empacotamentoPosicao';
import { IEmpacotamentoPersistence } from "../dataschema/IEmpacotamentoPersistence";
import { Document, Model } from "mongoose";

export class EmpacotamentoMap extends Mapper<Empacotamento> {

  public static toDTO( empacotamento: Empacotamento): IEmpacotamentoDTO {
    return {
      id: empacotamento.id.toString(),
      entregaId: empacotamento.entregaId,
      posicaoX: empacotamento.posicao.x,
      posicaoY: empacotamento.posicao.y,
      posicaoZ: empacotamento.posicao.z
    } as IEmpacotamentoDTO;
  }


  public static toDomain (empacotamento: any | Model<IEmpacotamentoPersistence & Document> ): Empacotamento {
    const empacotamentoOrError = Empacotamento.create(
      empacotamento,
      new UniqueEntityID(empacotamento.domainId)
    );

    empacotamentoOrError.isFailure ? console.log(empacotamentoOrError.error) : '';

    return empacotamentoOrError.isSuccess ? empacotamentoOrError.getValue() : null;
  }


  public static toPersistence (empacotamento: Empacotamento): any {
    return {
      domainId: empacotamento.id.toString(),
      entregaId: empacotamento.entregaId,
      posicaoX: empacotamento.posicao.x,
      posicaoY: empacotamento.posicao.y,
      posicaoZ: empacotamento.posicao.z,
    }
  }
}