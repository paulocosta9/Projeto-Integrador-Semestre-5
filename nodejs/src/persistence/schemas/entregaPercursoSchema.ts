import { IPercursoPersistence } from '../../dataschema/IPercursoPersistence';
import mongoose from 'mongoose';
import { EntregaPercurso } from '../../domain/entregaPercurso';

const entregaPercursoSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    armazemId: { type: Number, unique: false },
    entrega: { type: Number, unique: false },
    percursoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Percurso' }
  },
  {
    timestamps: true
  }
);



export default mongoose.model<IPercursoPersistence & mongoose.Document>('EntregaPercurso', entregaPercursoSchema);
