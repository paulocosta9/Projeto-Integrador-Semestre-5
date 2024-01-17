import { Repo } from "../../core/infra/Repo";
import { Empacotamento } from "../../domain/empacotamento";
import { EmpacotamentoId } from "../../domain/empacotamentoId";

export default interface IEmpacotamentoRepo extends Repo<Empacotamento> {
  save(empacotamento: Empacotamento): Promise<Empacotamento>;
  findByDomainId (empacotamentoId: EmpacotamentoId | string): Promise<Empacotamento>;
  delete (empacotamentoId: EmpacotamentoId | string): Promise<Empacotamento>;
  findAll (): Promise<Empacotamento[]>;

    
}