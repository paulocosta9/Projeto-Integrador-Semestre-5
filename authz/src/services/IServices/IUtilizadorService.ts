import { Result } from "../../core/logic/Result";
import IUtilizadorDTO from "../../dto/IUtilizadorDTO";

export default interface IUtilizadorService {
  createUtilizador(utilizadorDTO: IUtilizadorDTO): Promise<Result<IUtilizadorDTO>>;

  getUtilizadores(): Promise<Result<IUtilizadorDTO[]>>;
  getUtilizador(utilizadorId: string): Promise<Result<IUtilizadorDTO>>;
  getByEmail(email: string): Promise<Result<IUtilizadorDTO>>;
  getByNumeroTelemovel(numeroTelemovel: string): Promise<Result<IUtilizadorDTO>>;
  getUsers(): Promise<Result<IUtilizadorDTO[]>>;
  getAccessToken(email: string): Promise<Result<IUtilizadorDTO>>
  updateUtilizador(utilizadorDTO: IUtilizadorDTO): Promise<Result<IUtilizadorDTO>>;


}
