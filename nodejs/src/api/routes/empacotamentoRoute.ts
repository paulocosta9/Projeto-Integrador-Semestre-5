import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';

import config from '../../../config';
import IEmpacotamentoController from '../../controllers/IControllers/IEmpacotamentoController';

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

  app.use('/empacotamentos', route);

  const ctrl = Container.get(config.controllers.empacotamento.name) as IEmpacotamentoController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        entregaId: Joi.string().required(),
        posicaoX: Joi.number().required(),
        posicaoY: Joi.number().required(),
        posicaoZ: Joi.number().required()
      }),
    }),
    (req, res, next) => ctrl.createEmpacotamento(req, res, next),
  );

  route.put(
    '',
    celebrate({
      body: Joi.object({
        id: Joi.string().required(),
        entregaId: Joi.string().required(),
        posicaoX: Joi.number().required(),
        posicaoY: Joi.number().required(),
        posicaoZ: Joi.number().required()
      }),
    }),
    (req, res, next) => ctrl.updateEmpacotamento(req, res, next),
  );

  route.get('/:str', (req, res, next) => ctrl.getEmpacotamento(req.params.str, req, res, next));

  route.get('', (req, res, next) => ctrl.getEmpacotamentos(req, res, next));

  route.delete('/:str', (req, res, next) => ctrl.deleteEmpacotamento(req.params.str, req, res, next));
};