import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IUTilizador from './IControllers/IUtilizadorController';
import IUtilizadorService from '../services/IServices/IUtilizadorService';
import IUtilizadorDTO from '../dto/IUtilizadorDTO';

import { Result } from '../core/logic/Result';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IUtilizadorController from './IControllers/IUtilizadorController';

@Service()
export default class UtilizadorController implements IUtilizadorController /* TODO: extends ../core/infra/BaseController */ {
  constructor(@Inject(config.services.utilizador.name) private utilizadorServiceInstance: IUtilizadorService) { }

  public async createUtilizador(req: Request, res: Response, next: NextFunction) {
    try {
      const utilizadorOrError = (await this.utilizadorServiceInstance.createUtilizador(req.body as IUtilizadorDTO)) as Result<
        IUtilizadorDTO
      >;

      if (utilizadorOrError.isFailure) {
        return res.status(402).send(utilizadorOrError.errorValue());
      }

      const utilizadorDTO = utilizadorOrError.getValue();
      return res.json(utilizadorDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateUtilizador(req: Request, res: Response, next: NextFunction) {
    try {
      const utilizadorOrError = (await this.utilizadorServiceInstance.updateUtilizador(req.body as IUtilizadorDTO)) as Result<
        IUtilizadorDTO
      >;

      if (utilizadorOrError.isFailure) {
        return res.status(404).send(utilizadorOrError.errorValue());
      }

      const utilizadorDTO = utilizadorOrError.getValue();
      return res.status(201).json(utilizadorDTO);
    } catch (e) {
      return next(e);
    }
  }
  public async getByEmail(email: string, req: Request, res: Response, next: NextFunction) {
    try {
      const utilizadorOrError = (await this.utilizadorServiceInstance.getByEmail(email)) as Result<
        IUtilizadorDTO
      >;

      if (utilizadorOrError.isFailure) {
        return res.status(404).send(utilizadorOrError.errorValue());
      }

      const utilizadorDTO = utilizadorOrError.getValue();
      return res.status(200).json(utilizadorDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const utilizadorOrError = await this.utilizadorServiceInstance.getUsers() as Result<IUtilizadorDTO[]>;

      if (utilizadorOrError.isFailure) {
        return res.status(404).send(utilizadorOrError.errorValue());
      }

      const usersDTO = utilizadorOrError.getValue();
      return res.status(200).json(usersDTO);
    }
    catch (e) {
      return next(e);
    }
  };


  public async getAccessToken(email: string, req: Request, res: Response, next: NextFunction) {
    try {
      const utilizadorOrError = (await this.utilizadorServiceInstance.getAccessToken(email)) as Result<
        IUtilizadorDTO
      >;

      if (utilizadorOrError.isFailure) {
        return res.status(404).send(utilizadorOrError.errorValue());
      }

      const utilizadorDTO = utilizadorOrError.getValue();
      return res.status(200).json(utilizadorDTO);
    } catch (e) {
      return next(e);
    }
  }
}