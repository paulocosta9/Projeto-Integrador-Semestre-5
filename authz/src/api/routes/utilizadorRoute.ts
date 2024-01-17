import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IUtilizadorController from '../../controllers/IControllers/IUtilizadorController';

import config from '../../../config';

const route = Router();

export default (app: Router) => {
  app.use('/utilizador', route);

  const ctrl = Container.get(config.controllers.utilizador.name) as IUtilizadorController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        primeiroNome: Joi.string().required(),
        ultimoNome: Joi.string().required(),
        email: Joi.string().required(),
        cargo: Joi.string().required(),
        numeroTelemovel: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.createUtilizador(req, res, next),
  );

  route.put(
    '',
    celebrate({
      body: Joi.object({
        primeiroNome: Joi.string().required(),
        ultimoNome: Joi.string().required(),
        email: Joi.string().required(),
        cargo: Joi.string().required(),
        numeroTelemovel: Joi.string().required(),
        ativo: Joi.boolean().required(),
      }),
    }),
    (req, res, next) => ctrl.updateUtilizador(req, res, next),
  );

  route.get('/email/:str', (req, res, next) => ctrl.getByEmail(req.params.str, req, res, next));
  route.get('/accessToken/:str', (req, res, next) => ctrl.getAccessToken(req.params.str, req, res, next));

  route.get('', (req, res, next) => ctrl.getUsers(req, res, next));


};
