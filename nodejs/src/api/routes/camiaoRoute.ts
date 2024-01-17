import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import ICamiaoController from '../../controllers/IControllers/ICamiaoController';

import config from '../../../config';

const route = Router();

export default (app: Router) => {
  const fs = require('fs');
  const jwt = require('jsonwebtoken');
  const publicKey = fs.readFileSync('./public.key', 'utf8');

  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    //console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, publicKey, (error, user) => {
      if (error) {
        return res.sendStatus(403);
      }
      else {
        if (user.cargo != "Frota" && user.cargo != "Admin" && user.cargo != "Logistica") {
          console.log("!2!")
          return res.sendStatus(401)
        }
      }

      next();
    });
  });

  app.use('/camioes', route);

  const ctrl = Container.get(config.controllers.camiao.name) as ICamiaoController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        nome: Joi.string().required(),
        matricula: Joi.string().required(),
        tara: Joi.number().required(),
        capacidadeCarga: Joi.number().required(),
        cargaTotalBat: Joi.number().required(),
        autonomiaCargaMax: Joi.number().required(),
        tempoCarregamento: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.createCamiao(req, res, next),
  );

  route.put(
    '',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        nome: Joi.string().required(),
        matricula: Joi.string().required(),
        tara: Joi.number().required(),
        capacidadeCarga: Joi.number().required(),
        cargaTotalBat: Joi.number().required(),
        autonomiaCargaMax: Joi.number().required(),
        tempoCarregamento: Joi.number().required(),
      }),
    }),
    (req, res, next) => ctrl.updateCamiao(req, res, next),
  );

  route.get('/:str', (req, res, next) => ctrl.getCamiao(req.params.str, req, res, next));

  route.get('', (req, res, next) => ctrl.getCamioes(req, res, next));

  route.delete('/:str', (req, res, next) => ctrl.deleteCamiao(req.params.str, req, res, next));

  route.get('/matricula/:str', (req, res, next) => ctrl.getMatricula(req.params.str, req, res, next));

  route.get('/nome/:str', (req, res, next) => ctrl.getByNome(req.params.str, req, res, next));

  route.patch('/matricula/:str', (req, res, next) => ctrl.patchCamiao(req.params.str, req, res, next));
};
