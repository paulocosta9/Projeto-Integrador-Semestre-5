import { Request, Response, NextFunction } from 'express';

export default interface IEmpacotamentoController {
  createEmpacotamento(req: Request, res: Response, next: NextFunction);
  updateEmpacotamento(req: Request, res: Response, next: NextFunction);
  getEmpacotamento(empacotamentoId: string, req: Request, res: Response, next: NextFunction);
  deleteEmpacotamento(empacotamentoId: string, req: Request, res: Response, next: NextFunction);
  getEmpacotamentos(req: Request, res: Response, next: NextFunction);

}
