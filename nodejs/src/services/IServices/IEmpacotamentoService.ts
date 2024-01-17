import { Result } from "../../core/logic/Result";
import IEmpacotamentoDTO from "../../dto/IEmpacotamentoDTO";

export default interface IEmpacotamentoService  {
  createEmpacotamento(empacotamentoDTO: IEmpacotamentoDTO): Promise<Result<IEmpacotamentoDTO>>;
  updateEmpacotamento(empacotamentoDTO: IEmpacotamentoDTO): Promise<Result<IEmpacotamentoDTO>>;
  getEmpacotamento (empacotamentoDTO: string): Promise<Result<IEmpacotamentoDTO>>;
  deleteEmpacotamento (empacotamentoDTO: string): Promise<Result<IEmpacotamentoDTO>>;
  getEmpacotamentos (): Promise<Result<IEmpacotamentoDTO[]>>;
}