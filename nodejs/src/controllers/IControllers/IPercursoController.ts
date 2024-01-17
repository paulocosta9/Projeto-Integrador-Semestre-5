import { Request, Response, NextFunction } from 'express';

export default interface IPercursoController {

  fazPercurso(req: Request, res: Response, next: NextFunction);
  fazHeuristica(req: Request, res: Response, next: NextFunction);
  getPercursos(req: Request, res: Response, next: NextFunction);
  getPercursosByData(data: string, res: Response, next: NextFunction)
  fazAlgoritmoGenetico(req: Request, res: Response, next: NextFunction);
}
