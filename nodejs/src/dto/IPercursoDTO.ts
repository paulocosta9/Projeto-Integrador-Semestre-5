import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { Camiao } from "../domain/camiao";
import { EntregaPercurso } from "../domain/entregaPercurso";

export default interface IPercursoDTO {
  nome: string,
  data: string,
}

export default interface IHeuristicaDTO {
  nome: string,
  data: string,
  heuristica: string,
}

export default interface IPercursoResultadoDTO {
  percurso: string,
  tempo: number,
}

export default interface IPercursoResultadoBDDTO {
  id: string,
  percurso: string,
  tempo: number,
  camiao: string,
  entregas: UniqueEntityID[],
  dataPercurso: string,
}


export default interface IPercursoResultadoBDDTO2 {
  id: string,
  percurso: string,
  tempo: number,
  camiao: string,
  entregasObj: EntregaPercurso[],
  dataPercurso: string,
}