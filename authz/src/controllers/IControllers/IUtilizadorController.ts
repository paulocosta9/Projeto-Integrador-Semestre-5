import { Request, Response, NextFunction } from 'express';

export default interface IUtilizadorController {
  createUtilizador(req: Request, res: Response, next: NextFunction);

  getByEmail(email: string, req: Request, res: Response, next: NextFunction)

  getUsers(req: Request, res: Response, next: NextFunction);

  updateUtilizador(req: Request, res: Response, next: NextFunction);

  getAccessToken(email: string, req: Request, res: Response, next: NextFunction);
}
