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
  port: parseInt(process.env.PORT, 10) || 3000,

  /**
   * That long string from mlab
   */
  databaseURL: process.env.MONGODB_URI || "mongodb+srv://slts:slts@projeto.crbldoj.mongodb.net/logistica?retryWrites=true&w=majority",

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET || "my sakdfho2390asjod$%jl)!sdjas0i secret",

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
    role: {
      name: "RoleController",
      path: "../controllers/roleController"
    },
<<<<<<< HEAD
    rota:{
      name: "RotaController",
      path: "../controllers/rotaController"
=======
    empacotamento: {
      name: "EmpacotamentoController",
      path: "../controllers/empacotamentoController"
>>>>>>> 36bf5333151c083d46c0f20cc36e09f3455cf17b
    }
  },

  repos: {
    role: {
      name: "RoleRepo",
      path: "../repos/roleRepo"
    },
    user: {
      name: "UserRepo",
      path: "../repos/userRepo"
    },
<<<<<<< HEAD
    rota: {
      name: "RotaRepo",
      path: "../repos/rotaRepo"
=======
    empacotamento: {
      name: "EmpacotamentoRepo",
      path: "../repos/empacotamentoRepo"
>>>>>>> 36bf5333151c083d46c0f20cc36e09f3455cf17b
    }
  },

  services: {
    role: {
      name: "RoleService",
      path: "../services/roleService"
    },
<<<<<<< HEAD
    rota: {
      name: "RotaService",
      path: "../services/rotaService"
=======
    empacotamento: {
      name: "EmpacotamentoService",
      path: "../services/empacotamentoService"
>>>>>>> 36bf5333151c083d46c0f20cc36e09f3455cf17b
    }
  },
};
