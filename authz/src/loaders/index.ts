import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import Logger from './logger';

import config from '../../config';
import path from 'path';

export default async ({ expressApp }) => {
  const mongoConnection = await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');



  const utilizadorSchema = {
    // compare with the approach followed in repos and services
    name: 'utilizadorSchema',
    schema: '../persistence/schemas/utilizadorSchema',
  };

  const utilizadorController = {
    name: config.controllers.utilizador.name,
    path: config.controllers.utilizador.path,
  };

  const utilizadorRepo = {
    name: config.repos.utilizador.name,
    path: config.repos.utilizador.path,
  };

  const utilizadorService = {
    name: config.services.utilizador.name,
    path: config.services.utilizador.path,
  };



  await dependencyInjectorLoader({
    mongoConnection,
    schemas: [utilizadorSchema],
    controllers: [utilizadorController],
    repos: [utilizadorRepo],
    services: [utilizadorService],

  });
  Logger.info('✌️ Schemas, Controllers, Repositories, Services, etc. loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
