import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import path from 'path';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  const rotaSchema = {
    // compare with the approach followed in repos and services
    name: 'rotaSchema',
    schema: '../persistence/schemas/rotaSchema',
  };

  const empacotamentoSchema = {
    // compare with the approach followed in repos and services
    name: 'empacotamentoSchema',
    schema: '../persistence/schemas/empacotamentoSchema',
  };

  const camiaoSchema = {
    // compare with the approach followed in repos and services
    name: 'camiaoSchema',
    schema: '../persistence/schemas/camiaoSchema',
  };


  const percursoSchema = {
    // compare with the approach followed in repos and services
    name: 'percursoSchema',
    schema: '../persistence/schemas/percursoSchema',
  };

  const entregaPercursoSchema = {
    // compare with the approach followed in repos and services
    name: 'entregaPercursoSchema',
    schema: '../persistence/schemas/entregaPercursoSchema',
  };

  const rotaController = {
    name: config.controllers.rota.name,
    path: config.controllers.rota.path,
  };

  const percursoController = {
    name: config.controllers.percurso.name,
    path: config.controllers.percurso.path,
  };

  const rotaRepo = {
    name: config.repos.rota.name,
    path: config.repos.rota.path,
  };

  const entregaRepo = {
    name: config.repos.entrega.name,
    path: config.repos.entrega.path,
  };

  const percursoRepo = {
    name: config.repos.percurso.name,
    path: config.repos.percurso.path,
  }

  const entregaPercursoRepo = {
    name: config.repos.entregaPercurso.name,
    path: config.repos.entregaPercurso.path,
  }

  const armazemRepo = {
    name: config.repos.armazem.name,
    path: config.repos.armazem.path,
  };

  const camiaoController = {
    name: config.controllers.camiao.name,
    path: config.controllers.camiao.path,
  };

  const camiaoRepo = {
    name: config.repos.camiao.name,
    path: config.repos.camiao.path,
  };


  const rotaService = {
    name: config.services.rota.name,
    path: config.services.rota.path,
  };

  const percursoService = {
    name: config.services.percurso.name,
    path: config.services.percurso.path,
  };

  const camiaoService = {
    name: config.services.camiao.name,
    path: config.services.camiao.path,
  };

  const empacotamentoController = {
    name: config.controllers.empacotamento.name,
    path: config.controllers.empacotamento.path,
  };

  const empacotamentoRepo = {
    name: config.repos.empacotamento.name,
    path: config.repos.empacotamento.path,
  };

  const empacotamentoService = {
    name: config.services.empacotamento.name,
    path: config.services.empacotamento.path,
  };



  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [rotaSchema, empacotamentoSchema, camiaoSchema, percursoSchema, entregaPercursoSchema],
    controllers: [rotaController, empacotamentoController, camiaoController, percursoController],
    repos: [rotaRepo, empacotamentoRepo, camiaoRepo, entregaRepo, armazemRepo, percursoRepo, entregaPercursoRepo],
    services: [rotaService, empacotamentoService, camiaoService, percursoService],

  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
