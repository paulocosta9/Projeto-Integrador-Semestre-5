import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { EntregaPercurso } from "../domain/entregaPercurso";

export interface IPercursoPersistence {
    domainId: string;
    percurso: string;
    tempo: number;
    camiao: string;
    entregas: UniqueEntityID[];
    dataPercurso: string;
}