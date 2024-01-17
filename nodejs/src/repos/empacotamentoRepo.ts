import { Service, Inject } from 'typedi';

import IEmpacotamentoRepo from "../services/IRepos/IEmpacotamentoRepo";

import { Document, FilterQuery, Model } from 'mongoose';
import { IEmpacotamentoPersistence } from '../dataschema/IEmpacotamentoPersistence';
import { Empacotamento } from '../domain/empacotamento';
import { EmpacotamentoId } from '../domain/empacotamentoId';
import { EmpacotamentoMap } from '../mappers/EmpacotamentoMap';

@Service()
export default class EmpacotamentoRepo implements IEmpacotamentoRepo {
  private models: any;

  constructor(
    @Inject('empacotamentoSchema') private empacotamentoSchema : Model<IEmpacotamentoPersistence & Document>,
  ) {}

  private createBaseQuery (): any {
    return {
      where: {},
    }
  }

  public async exists(empacotamento: Empacotamento): Promise<boolean> {
    
    const idX = empacotamento.id instanceof EmpacotamentoId ? (<EmpacotamentoId>empacotamento.id).toValue() : empacotamento.id;

    const query = { domainId: idX}; 
    const empacotamentoDocument = await this.empacotamentoSchema.findOne( query as FilterQuery<IEmpacotamentoPersistence & Document>);

    return !!empacotamentoDocument === true;
  }

  public async save (empacotamento: Empacotamento): Promise<Empacotamento> {
    const query = { domainId: empacotamento.id.toString()}; 

    const empacotamentoDocument = await this.empacotamentoSchema.findOne( query );

    try {
      if (empacotamentoDocument === null ) {
        const rawEmpacotamento: any = EmpacotamentoMap.toPersistence(empacotamento);

        const empacotamentoCreated = await this.empacotamentoSchema.create(rawEmpacotamento);

        return EmpacotamentoMap.toDomain(empacotamentoCreated);
      } else {
        empacotamentoDocument.entregaId = empacotamento.entregaId;
        empacotamentoDocument.posicaoX = empacotamento.posicao.x;
        empacotamentoDocument.posicaoY = empacotamento.posicao.y;
        empacotamentoDocument.posicaoZ = empacotamento.posicao.z;
        await empacotamentoDocument.save();

        return empacotamento;
      }
    } catch (err) {
      throw err;
    }
  }

  public async findByDomainId (empacotamentoId: EmpacotamentoId | string): Promise<Empacotamento> {
    const query = { domainId: empacotamentoId};
    const empacotamentoRecord = await this.empacotamentoSchema.findOne( query as FilterQuery<IEmpacotamentoPersistence & Document> );

    if( empacotamentoRecord != null) {
      return EmpacotamentoMap.toDomain(empacotamentoRecord);
    }
    else
      return null;
  }

  public async findAll (): Promise<Empacotamento[]> {
    const empacotamentoRecord = await this.empacotamentoSchema.find();

    if( empacotamentoRecord != null) {
      var empacotamentoArray = [];
      for (let index = 0; index < empacotamentoRecord.length; ++index) {
        empacotamentoArray[index] = EmpacotamentoMap.toDomain(empacotamentoRecord[index]);
    }
      return empacotamentoArray;
    }
    else
      return null;
  }

  public async delete (empacotamentoId: EmpacotamentoId | string): Promise<Empacotamento> {
    const query = { domainId: empacotamentoId};
    const empacotamentoRecord = await this.empacotamentoSchema.findOneAndDelete( query as FilterQuery<IEmpacotamentoPersistence & Document> );

    if( empacotamentoRecord != null) {
      return EmpacotamentoMap.toDomain(empacotamentoRecord);
    }
    else
      return null;
  }
}