import { Repo } from '../../core/infra/Repo';
import { Camiao } from '../../domain/camiao';
import { CamiaoId } from '../../domain/camiaoId';

export default interface ICamiaoRepo extends Repo<Camiao> {
  save(camiao: Camiao): Promise<Camiao>;
  findByDomainId(camiaoId: CamiaoId | string): Promise<Camiao>;
  findAll(): Promise<Camiao[]>;
  delete(camiaoId: CamiaoId | string): Promise<Camiao>;
  findByMatricula(matriculaString: String | string): Promise<Camiao>;
  findByNome(nomeString: String | string): Promise<Camiao>;
}
