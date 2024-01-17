import { Percurso } from "../../domain/percurso";
import { Repo } from '../../core/infra/Repo';
import IAlgGenDTO from "../../dto/IAlgoritmoGeneticoDTO";
import IAlgGenResultDTO from "../../dto/IAlgoritmoGeneticoDTO";


export default interface IPercursoRepo extends Repo<Percurso> {
  fazAlgoritmoGenetico(obj: any): Promise<IAlgGenResultDTO>;
  save(rota: Percurso): Promise<Percurso>;
  findAll(): Promise<Percurso[]>;
  fazerHeuristica(obj: any, heuristica: string): Promise<any>;
  fazerPercurso(json: any): Promise<any>;
  findAllPercurso(percurso: string, camiao: string, dataPercurso: string): Promise<Percurso[]>;
  findAllDataPercurso(dataPercurso: string): Promise<Percurso[]>;
}