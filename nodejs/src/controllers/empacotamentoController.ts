import { Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import config from "../../config";

import { Result } from "../core/logic/Result";
import IEmpacotamentoController from './IControllers/IEmpacotamentoController';

import IEmpacotamentoDTO from '../dto/IEmpacotamentoDTO';
import IEmpacotamentoService from '../services/IServices/IEmpacotamentoService';

@Service()
export default class empacotamentoController implements IEmpacotamentoController /* TODO: extends ../core/infra/BaseController */ {
  constructor(
      @Inject(config.services.empacotamento.name) private empacotamentoServiceInstance : IEmpacotamentoService
  ) {}

    async createEmpacotamento(req: Request, res: Response, next: NextFunction) {
       
        try {
            const empacotamentoOrError = await this.empacotamentoServiceInstance.createEmpacotamento(req.body as IEmpacotamentoDTO) as Result<IEmpacotamentoDTO>;
              
            if (empacotamentoOrError.isFailure) {
              return res.status(402).send(empacotamentoOrError.errorValue());
            }
      
            const empacotamentoDTO = empacotamentoOrError.getValue();
            return res.json( empacotamentoDTO ).status(201);
          }
          catch (e) {
            return next(e);
          }
    }

    async updateEmpacotamento(req: Request, res: Response, next: NextFunction) {
        
        try {
            const empacotamentoOrError = await this.empacotamentoServiceInstance.updateEmpacotamento(req.body as IEmpacotamentoDTO) as Result<IEmpacotamentoDTO>;
      
            if (empacotamentoOrError.isFailure) {
              return res.status(404).send(empacotamentoOrError.errorValue());
            }
      
            const empacotamentoDTO = empacotamentoOrError.getValue();
            return res.status(201).json( empacotamentoDTO );
          }
          catch (e) {
            return next(e);
          }
    }

    async getEmpacotamento(empacotamentoId: string, req: Request, res: Response, next: NextFunction) {
        
        try {
            const postOrError = (await this.empacotamentoServiceInstance.getEmpacotamento(empacotamentoId)) as Result<IEmpacotamentoDTO>;
            if (postOrError.isFailure) {
              return res.status(404).send(postOrError.errorValue());
            }
      
            const postDTO = postOrError.getValue();
            return res.status(200).json(postDTO);
          } catch (e) {
            return next(e);
          }
    }

    public async getEmpacotamentos(req: Request, res: Response, next: NextFunction) {
      try {
        const empacotamentosOrError = await this.empacotamentoServiceInstance.getEmpacotamentos() as Result<IEmpacotamentoDTO[]>;
  
        if (empacotamentosOrError.isFailure) {
          return res.status(404).send(empacotamentosOrError.errorValue());
        }
  
        const empacotamentosDTO = empacotamentosOrError.getValue();
        return res.status(200).json( empacotamentosDTO );
      }
      catch (e) {
        return next(e);
      }
    };

    public async deleteEmpacotamento(empacotamentoId: string, req: Request, res: Response, next: NextFunction) {
      try {
        const empacotamentoOrError = (await this.empacotamentoServiceInstance.deleteEmpacotamento(empacotamentoId)) as Result<IEmpacotamentoDTO>;
        if (empacotamentoOrError.isFailure) {
          return res.status(404).send(empacotamentoOrError.errorValue());
        }
  
        const postDTO = empacotamentoOrError.getValue();
        return res.status(200).json(postDTO);
      } catch (e) {
        return next(e);
      }
    }

}