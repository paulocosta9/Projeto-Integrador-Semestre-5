import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import IRotaController from "./IControllers/IRotaController";
import IRotaService from '../services/IServices/IRotaService';
import IRotaDTO from '../dto/IRotaDTO';

import { Result } from "../core/logic/Result";

@Service()
export default class RotaController implements IRotaController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.rota.name) private rotaServiceInstance : IRotaService
  ) {}

  public async createRota(req: Request, res: Response, next: NextFunction) {
    try {
      const rotaOrError = await this.rotaServiceInstance.createRota(req.body as IRotaDTO) as Result<IRotaDTO>;
        
      if (rotaOrError.isFailure) {
        return res.status(402).send(rotaOrError.errorValue());
      }

      const rotaDTO = rotaOrError.getValue();
      return res.json( rotaDTO ).status(201);
    }
    catch (e) {
      return next(e);
    }
  };

  public async updateRota(req: Request, res: Response, next: NextFunction) {
    try {
      const rotaOrError = await this.rotaServiceInstance.updateRota(req.body as IRotaDTO) as Result<IRotaDTO>;

      if (rotaOrError.isFailure) {
        return res.status(404).send(rotaOrError.errorValue());
      }

      const rotaDTO = rotaOrError.getValue();
      return res.status(201).json( rotaDTO );
    }
    catch (e) {
      return next(e);
    }
  };



  public async getRota(rotaId: string, req: Request, res: Response, next: NextFunction) {
    try {
      const postOrError = (await this.rotaServiceInstance.getRota(rotaId)) as Result<IRotaDTO>;
      if (postOrError.isFailure) {
        return res.status(404).send(postOrError.errorValue());
      }

      const postDTO = postOrError.getValue();
      return res.status(200).json(postDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getRotas(req: Request, res: Response, next: NextFunction) {
    try {
      const rotasOrError = await this.rotaServiceInstance.getRotas() as Result<IRotaDTO[]>;

      if (rotasOrError.isFailure) {
        return res.status(404).send(rotasOrError.errorValue());
      }

      const rotasDTO = rotasOrError.getValue();
      return res.status(200).json( rotasDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async getRotasInicial(inicio: string, res: Response, next: NextFunction) {
    try {
      const rotasOrError = await this.rotaServiceInstance.getRotasInicial(inicio) as Result<IRotaDTO[]>;

      if (rotasOrError.isFailure) {
        return res.status(404).send(rotasOrError.errorValue());
      }

      const rotasDTO = rotasOrError.getValue();
      return res.status(200).json( rotasDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async getRotasFinal(final: string, res: Response, next: NextFunction) {
    try {
      const rotasOrError = await this.rotaServiceInstance.getRotasFinal(final) as Result<IRotaDTO[]>;

      if (rotasOrError.isFailure) {
        return res.status(404).send(rotasOrError.errorValue());
      }

      const rotasDTO = rotasOrError.getValue();
      return res.status(200).json( rotasDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async getRotasInicialFinal(inicio: string,final:string,  res: Response, next: NextFunction) {
    try {
      const rotasOrError = await this.rotaServiceInstance.getRotasInicialFinal(inicio,final) as Result<IRotaDTO[]>;

      if (rotasOrError.isFailure) {
        return res.status(404).send(rotasOrError.errorValue());
      }

      const rotasDTO = rotasOrError.getValue();
      return res.status(200).json( rotasDTO );
    }
    catch (e) {
      return next(e);
    }
  };

  public async deleteRota(rotaId: string, req: Request, res: Response, next: NextFunction) {
    try {
      const rotasOrError = (await this.rotaServiceInstance.deleteRota(rotaId)) as Result<IRotaDTO>;
      if (rotasOrError.isFailure) {
        return res.status(404).send(rotasOrError.errorValue());
      }

      const postDTO = rotasOrError.getValue();
      return res.status(200).json(postDTO);
    } catch (e) {
      return next(e);
    }
  };
}