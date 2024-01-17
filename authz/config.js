import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10) || 2225,

  /**
   * That long string from mlab
   */
  databaseURL:
    process.env.MONGODB_URI ||
    'mongodb+srv://slts:slts@projeto.crbldoj.mongodb.net/utilizadores?retryWrites=true&w=majority',

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || 'my sakdfho2390asjod$%jl)!sdjas0i secret',

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/api',
  },

  controllers: {
    utilizador: {
      name: 'UtilizadorController',
      path: '../controllers/utilizadorController',

    },
  },
  repos: {

    utilizador: {
      name: 'UtilizadorRepo',
      path: '../repos/utilizadorRepo',

    },
  },

  services: {

    utilizador: {
      name: 'UtilizadorService',
      path: '../services/utilizadorService',
    }

  },
  logistica: {
    url: 'http://vsgate-s1.dei.isep.ipp.pt:10844',
  },
  gestaoArmazens: {
    url: 'http://uvm010:5001'
  },
  planeamento: {
    url: 'http://vs219.dei.isep.ipp.pt:7000'
  },

  numeroMaximoDeEntregas: 10,
  armazemPartidaChegada: '005'
};
