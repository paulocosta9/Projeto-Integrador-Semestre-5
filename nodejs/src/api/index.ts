import { Router } from 'express';
import rota from './routes/rotaRoute';
import empacotamento from './routes/empacotamentoRoute';
import camiao from './routes/camiaoRoute';
import percurso from './routes/percursoRoute';

export default () => {
  const app = Router();
  camiao(app);
  rota(app);
  empacotamento(app);

  percurso(app);

  return app;
};
