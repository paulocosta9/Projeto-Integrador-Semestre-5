import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IRotaController from '../../controllers/IControllers/IRotaController';

import config from '../../../config';

const route = Router();

const fs = require('fs');
const jwt = require('jsonwebtoken');
const publicKey = fs.readFileSync('./public.key', 'utf8');
export default (app: Router) => {

  app.use((req, res, next) => {
    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.sendStatus(401);
    }

    jwt.verify(token, publicKey, (error, user) => {
      if (error) {
        return res.sendStatus(403);
      }
      else {
        if (user.cargo != "Logistica" && user.cargo != "Admin") {
          console.log("!1!")
          return res.sendStatus(401)
        }
      }

      next();
    });
  });
  app.use('/rotas', route);

  const ctrl = Container.get(config.controllers.rota.name) as IRotaController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        armazemInicial: Joi.string().required(),
        armazemFinal: Joi.string().required(),
        duracao: Joi.number().required(),
        energiaGasta: Joi.number().required(),
        distancia: Joi.number().required(),
        tempExtra: Joi.number().required()
      }),
    }),
    (req, res, next) => ctrl.createRota(req, res, next),
  );

  route.put(
    '',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        armazemInicial: Joi.string().required(),
        armazemFinal: Joi.string().required(),
        duracao: Joi.number().required(),
        energiaGasta: Joi.number().required(),
        distancia: Joi.number().required(),
        tempExtra: Joi.number().required()
      }),
    }),
    (req, res, next) => ctrl.updateRota(req, res, next),
  );

  route.get('', (req, res, next) => ctrl.getRotas(req, res, next));

  route.get('/armIn/:inicio', (req, res, next) => ctrl.getRotasInicial(req.params.inicio, res, next));

  route.get('/armFin/:final', (req, res, next) => ctrl.getRotasFinal(req.params.final, res, next));

  route.get('/armIn/:inicio/armFin/:final', (req, res, next) => ctrl.getRotasInicialFinal(req.params.inicio, req.params.final, res, next));

  route.get('/:str', (req, res, next) => ctrl.getRota(req.params.str, req, res, next));

  route.delete('/:str', (req, res, next) => ctrl.deleteRota(req.params.str, req, res, next));

};
