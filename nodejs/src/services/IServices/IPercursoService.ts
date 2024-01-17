import { Result } from "../../core/logic/Result";
import IAlgGenDTO from "../../dto/IAlgoritmoGeneticoDTO";
import IPercursoDTO from "../../dto/IPercursoDTO";
import IPercursoResultadoDTO from "../../dto/IPercursoDTO";
import IPercursoResultadoBDDTO2 from "../../dto/IPercursoDTO";
import IHeuristicaDTO from "../../dto/IPercursoDTO";

export default interface IPercursoService {
  fazPercurso(percursoDTO: IPercursoDTO): Promise<Result<IPercursoResultadoDTO>>;
  mockPlanning(percursoDTO: IPercursoDTO): Promise<Result<IPercursoResultadoBDDTO2>>;
  fazHeuristica(percursoDTO: IHeuristicaDTO): Promise<Result<IPercursoResultadoDTO>>;
  getPercursos(): Promise<Result<IPercursoResultadoBDDTO2[]>>;
  getPercursosByData(data: string): Promise<Result<IPercursoResultadoBDDTO2[]>>;
  fazAlgoritmoGenetico(algGenetico: IAlgGenDTO): Promise<Result<IPercursoResultadoBDDTO2[]>>;
}
