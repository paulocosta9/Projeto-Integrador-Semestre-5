import { Repo } from '../../core/infra/Repo';
import { Utilizador } from '../../domain/utilizador';
import { UtilizadorId } from '../../domain/utilizadorId';

export default interface ICamiaoRepo extends Repo<Utilizador> {
  save(utilizador: Utilizador): Promise<Utilizador>;
  findByDomainId(utilizadorId: UtilizadorId | string): Promise<Utilizador>;
  findAll(): Promise<Utilizador[]>;
  delete(utilizadorId: UtilizadorId | string): Promise<Utilizador>;
  findByEmail(email: String | string): Promise<Utilizador>;
  findByNumeroTelemovel(numeroTelemovel: string | string): Promise<Utilizador>;

}
