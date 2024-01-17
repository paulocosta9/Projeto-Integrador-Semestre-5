import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import ICamiaoController from './IControllers/ICamiaoController';
import ICamiaoService from '../services/IServices/ICamiaoService';
import ICamiaoDTO from '../dto/ICamiaoDTO';

import { Result } from '../core/logic/Result';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';

@Service()
export default class CamiaoController implements ICamiaoController /* TODO: extends ../core/infra/BaseController */ {
  constructor(@Inject(config.services.camiao.name) private camiaoServiceInstance: ICamiaoService) {}

  public async createCamiao(req: Request, res: Response, next: NextFunction) {
    try {
      const camiaoOrError = (await this.camiaoServiceInstance.createCamiao(req.body as ICamiaoDTO)) as Result<
        ICamiaoDTO
      >;

      if (camiaoOrError.isFailure) {
        return res.status(402).send(camiaoOrError.errorValue());
      }

      const camiaoDTO = camiaoOrError.getValue();
      return res.json(camiaoDTO).status(201);
    } catch (e) {
      return next(e);
    }
  }

  public async updateCamiao(req: Request, res: Response, next: NextFunction) {
    try {
      const camiaoOrError = (await this.camiaoServiceInstance.updateCamiao(req.body as ICamiaoDTO)) as Result<
        ICamiaoDTO
      >;

      if (camiaoOrError.isFailure) {
        return res.status(404).send(camiaoOrError.errorValue());
      }

      const camiaoDTO = camiaoOrError.getValue();
      return res.status(201).json(camiaoDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async patchCamiao(camiaoMatricula: string, req: Request, res: Response, next: NextFunction) {
    try {
      const camiaoOrError = (await this.camiaoServiceInstance.patchCamiao(camiaoMatricula, req)) as Result<
        ICamiaoDTO
      >;

      if (camiaoOrError.isFailure) {
        return res.status(404).send(camiaoOrError.errorValue());
      }

      const camiaoDTO = camiaoOrError.getValue();
      return res.status(201).json(camiaoDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getCamiao(camiaoId: string, req: Request, res: Response, next: NextFunction) {
    try {
      const postOrError = (await this.camiaoServiceInstance.getCamiao(camiaoId)) as Result<ICamiaoDTO>;
      if (postOrError.isFailure) {
        return res.status(404).send(postOrError.errorValue());
      }

      const postDTO = postOrError.getValue();
      return res.status(200).json(postDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getCamioes(req: Request, res: Response, next: NextFunction) {
    try {
      const camioesOrError = (await this.camiaoServiceInstance.getCamioes()) as Result<ICamiaoDTO[]>;

      if (camioesOrError.isFailure) {
        return res.status(404).send(camioesOrError.errorValue());
      }

      const camioesDTO = camioesOrError.getValue();
      return res.status(200).json(camioesDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async deleteCamiao(camiaoId: string, req: Request, res: Response, next: NextFunction) {
    try {
      const camiaoOrError = (await this.camiaoServiceInstance.deleteCamiao(camiaoId)) as Result<ICamiaoDTO>;
      if (camiaoOrError.isFailure) {
        return res.status(404).send(camiaoOrError.errorValue());
      }

      const postDTO = camiaoOrError.getValue();
      return res.status(200).json(postDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getMatricula(
    str: string,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction,
  ) {
    try {
      const postOrError = (await this.camiaoServiceInstance.getMatricula(str)) as Result<ICamiaoDTO>;
      if (postOrError.isFailure) {
        return res.status(404).send(postOrError.errorValue());
      }

      const postDTO = postOrError.getValue();
      return res.status(200).json(postDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getByNome(
    str: string,
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction,
  ) {
    try {
      const postOrError = (await this.camiaoServiceInstance.getByNome(str)) as Result<ICamiaoDTO>;
      if (postOrError.isFailure) {
        return res.status(404).send(postOrError.errorValue());
      }

      const postDTO = postOrError.getValue();
      return res.status(200).json(postDTO);
    } catch (e) {
      return next(e);
    }
  }
}
