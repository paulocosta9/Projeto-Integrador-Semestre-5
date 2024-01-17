import { Repo } from "../../core/infra/Repo";
import { Rota } from "../../domain/rota";
import { RotaId } from "../../domain/rotaId";

export default interface IRotaRepo extends Repo<Rota> {
  save(rota: Rota): Promise<Rota>;
  findByDomainId (rotaId: RotaId | string): Promise<Rota>;
  findAll (): Promise<Rota[]>;
  findAllArmazemInicial (inicio: string): Promise<Rota[]>;
  findAllArmazemFinal (final: string): Promise<Rota[]>;
  findAllArmazemInicialFinal (inicio: string,final: string): Promise<Rota[]>;
  delete (rotaId: RotaId | string): Promise<Rota>;

}