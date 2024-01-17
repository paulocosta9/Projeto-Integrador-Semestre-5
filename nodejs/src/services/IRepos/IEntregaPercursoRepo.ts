import { UniqueEntityID } from '../../core/domain/UniqueEntityID';
import { Repo } from '../../core/infra/Repo';
import { EntregaPercurso } from '../../domain/entregaPercurso';

export default interface IEntregaPercursoRepo extends Repo<EntregaPercurso> {
  save(entregaPercurso: EntregaPercurso): Promise<EntregaPercurso>;
  findUIDByDomainId(entregaPercurso: EntregaPercurso): Promise<UniqueEntityID>;
  findDomainByObjectId(id: UniqueEntityID): Promise<EntregaPercurso>;
}
