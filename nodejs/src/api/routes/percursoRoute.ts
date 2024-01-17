import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';

import { Container } from 'typedi';
import IPercursoController from '../../controllers/IControllers/IPercursoController';

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

  app.use('/percurso', route);

  const ctrl = Container.get(config.controllers.percurso.name) as IPercursoController;

  route.post(
    '',
    celebrate({
      body: Joi.object({
        nome: Joi.string().required(),
        data: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.fazPercurso(req, res, next),
  );

  route.get('/data/:data', (req, res, next) => ctrl.getPercursosByData(req.params.data, res, next));


  route.post(
    '/heuristica',
    celebrate({
      body: Joi.object({
        nome: Joi.string().required(),
        data: Joi.string().required(),
        heuristica: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.fazHeuristica(req, res, next),
  );

  route.get('', (req, res, next) => ctrl.getPercursos(req, res, next));

  route.post(
    '/algGenetico',
    celebrate({
      body: Joi.object({
        numero_geracoes: Joi.number().required(),
        dimensao_populacao: Joi.number().required(),
        prob_cruzamento: Joi.number().required(),
        prob_mutacao: Joi.number().required(),
        valor_minimo: Joi.number().required(),
        data: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.fazAlgoritmoGenetico(req, res, next),
  );


};
