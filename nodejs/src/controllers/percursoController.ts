import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from '../../config';

import IPercursoController from './IControllers/IPercursoController';
import IPercursoService from '../services/IServices/IPercursoService';
import IPercursoDTO from '../dto/IPercursoDTO';
import IPercursoResultanteDTO from '../dto/IPercursoDTO';
import IPercursoResultadoBDDTO from '../dto/IPercursoDTO';
import IPercursoResultadoBDDTO2 from '../dto/IPercursoDTO';
import IHeuristicaDTO from '../dto/IPercursoDTO';

import { Result } from '../core/logic/Result';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import IAlgGenDTO from '../dto/IAlgoritmoGeneticoDTO';

@Service()
export default class PercursoController
  implements IPercursoController /* TODO: extends ../core/infra/BaseController */ {
  constructor(@Inject(config.services.percurso.name) private percursoServiceInstance: IPercursoService) { }
  public async fazPercurso(req: Request, res: Response, next: NextFunction) {
    try {
      var percursoOrError = (await this.percursoServiceInstance.fazPercurso(req.body as IPercursoDTO)) as Result<
        IPercursoResultanteDTO
      >;
      if (percursoOrError.errorValue() != null) {
        if (percursoOrError.errorValue().toString() === 'Nao foi possivel establecer conexao!') {
          console.log('Nao foi possivel establecer conexao!')
          percursoOrError = (await this.percursoServiceInstance.mockPlanning(req.body as IPercursoDTO)) as Result<
            IPercursoResultanteDTO
          >;
        }
      }
      if (percursoOrError.isFailure) {
        return res.status(406).send(percursoOrError.errorValue()); //Method not allowed
      }

      return res.json(percursoOrError.getValue()).status(200);
    } catch (e) {
      return next(e);
    }
  }
  public async fazHeuristica(req: Request, res: Response, next: NextFunction) {
    try {
      var percursoOrError = (await this.percursoServiceInstance.fazHeuristica(req.body as IHeuristicaDTO)) as Result<
        IPercursoResultanteDTO
      >;

      if (percursoOrError.errorValue() != null) {
        if (percursoOrError.errorValue().toString() === 'Nao foi possivel establecer conexao!') {
          console.log('Nao foi possivel establecer conexao!')
          percursoOrError = (await this.percursoServiceInstance.mockPlanning(req.body as IPercursoDTO)) as Result<
            IPercursoResultanteDTO
          >;
        }
      }
      if (percursoOrError.isFailure) {
        return res.status(406).send('Nao foi possivel fazer o percurso'); //Method not allowed
      }

      return res.json(percursoOrError.getValue()).status(200);
    } catch (e) {
      return next(e);
    }
  }

  public async getPercursos(req: Request, res: Response, next: NextFunction) {
    try {
      const percursoOrError = (await this.percursoServiceInstance.getPercursos()) as Result<IPercursoResultadoBDDTO[]>;
      if (percursoOrError.isFailure) {
        return res.status(404).send(percursoOrError.errorValue());
      }

      const percursoDTO = percursoOrError.getValue();
      console.log(percursoDTO);
      return res.status(200).json(percursoDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async getPercursosByData(data: string, res: Response, next: NextFunction) {
    try {
      const percursoOrError = (await this.percursoServiceInstance.getPercursosByData(data)) as Result<
        IPercursoResultadoBDDTO[]
      >;
      if (percursoOrError.isFailure) {
        return res.status(404).send(percursoOrError.errorValue());
      }

      const percursoDTO = percursoOrError.getValue();
      return res.status(200).json(percursoDTO);
    } catch (e) {
      return next(e);
    }
  }

  public async fazAlgoritmoGenetico(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('-----------------------////-----------------------');
      const percursoOrError = (await this.percursoServiceInstance.fazAlgoritmoGenetico(
        req.body as IAlgGenDTO,
      )) as Result<IPercursoResultadoBDDTO2[]>;

      if (percursoOrError.isFailure) {
        return res.status(406).send(percursoOrError.errorValue()); //Method not allowed
      }

      return res.json(percursoOrError.getValue()).status(200);
    } catch (e) {
      return next(e);
    }
  }
}
