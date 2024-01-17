import { Request, Response, NextFunction } from 'express';

export default interface ICamiaoController {
  createCamiao(req: Request, res: Response, next: NextFunction);
  deleteCamiao(camiaoId: string, req: Request, res: Response, next: NextFunction);

  getCamioes(req: Request, res: Response, next: NextFunction);
  getCamiao(camiaoId: string, req: Request, res: Response, next: NextFunction);
  getByNome(str: string, req: Request, res: Response, next: NextFunction);
  getMatricula(str: string, req: Request, res: Response, next: NextFunction);

  updateCamiao(req: Request, res: Response, next: NextFunction);
  patchCamiao(camiaoMatricula: string, req: Request, res: Response, next: NextFunction);
}
