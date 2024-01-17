import { Result } from "../../core/logic/Result";
import IRotaDTO from "../../dto/IRotaDTO";

export default interface IRotaService  {
  createRota(rotaDTO: IRotaDTO): Promise<Result<IRotaDTO>>;
  updateRota(rotaDTO: IRotaDTO): Promise<Result<IRotaDTO>>;

  getRota (rotaId: string): Promise<Result<IRotaDTO>>;
  getRotas (): Promise<Result<IRotaDTO[]>>;

  getRotasInicial (armazemInicial : string): Promise<Result<IRotaDTO[]>>;
  getRotasFinal (armazemFinal : string): Promise<Result<IRotaDTO[]>>;
  getRotasInicialFinal (armazemInicial : string, armazemFinal: string): Promise<Result<IRotaDTO[]>>;

  deleteRota (rotaId: string): Promise<Result<IRotaDTO>>;
}
