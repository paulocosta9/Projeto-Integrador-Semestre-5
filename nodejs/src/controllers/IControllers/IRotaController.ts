import { Request, Response, NextFunction } from 'express';

export default interface IRotaController {
  createRota(req: Request, res: Response, next: NextFunction);
  updateRota(req: Request, res: Response, next: NextFunction);
  getRota(rotaId: string, req: Request, res: Response, next: NextFunction);
  getRotas(req: Request, res: Response, next: NextFunction);
  getRotasInicial(inicio: string, res: Response, next: NextFunction);
  getRotasFinal(final: string, res: Response, next: NextFunction);
  getRotasInicialFinal(inicio: string, final: string, res: Response, next: NextFunction);
  deleteRota(rotaId: string, req: Request, res: Response, next: NextFunction);
}
