import { Router } from 'express';

import utilizador from './routes/utilizadorRoute';


export default () => {
  const app = Router();

  utilizador(app)

  return app;
};
