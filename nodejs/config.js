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
  port: parseInt(process.env.PORT, 10) || 2223,

  /**
   * That long string from mlab
   */
  databaseURL:
    process.env.MONGODB_URI ||
    'mongodb+srv://slts:slts@projeto.crbldoj.mongodb.net/logistica?retryWrites=true&w=majority',

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
    rota: {
      name: 'RotaController',
      path: '../controllers/rotaController',
    },
    empacotamento: {
      name: 'EmpacotamentoController',
      path: '../controllers/empacotamentoController',
    },
    camiao: {
      name: 'CamiaoController',
      path: '../controllers/camiaoController',
    },
    percurso: {
      name: 'PercursoController',
      path: '../controllers/percursoController',
    },
  },

  repos: {
    rota: {
      name: 'RotaRepo',
      path: '../repos/rotaRepo',
    },
    empacotamento: {
      name: 'EmpacotamentoRepo',
      path: '../repos/empacotamentoRepo',
    },
    camiao: {
      name: 'CamiaoRepo',
      path: '../repos/camiaoRepo',
    },
    entrega: {
      name: 'EntregaRepo',
      path: '../repos/entregaRepo',
    },
    armazem: {
      name: 'ArmazemRepo',
      path: '../repos/armazemRepo',
    },
    percurso: {
      name: 'PercursoRepo',
      path: '../repos/percursoRepo',
    },
    entregaPercurso: {
      name: 'EntregaPercursoRepo',
      path: '../repos/entregaPercursoRepo',
    }
  },

  services: {
    rota: {
      name: 'RotaService',
      path: '../services/rotaService',
    },
    empacotamento: {
      name: 'EmpacotamentoService',
      path: '../services/empacotamentoService',
    },
    camiao: {
      name: 'CamiaoService',
      path: '../services/camiaoService',
    },
    percurso: {
      name: 'PercursoService',
      path: '../services/percursoService',
    },

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
  armazemPartidaChegada: '005',
  percentagemDeCapacidade: 0.8
};
