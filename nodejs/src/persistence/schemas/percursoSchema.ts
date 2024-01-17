import { IPercursoPersistence } from '../../dataschema/IPercursoPersistence';
import mongoose from 'mongoose';
import { EntregaPercurso } from '../../domain/entregaPercurso';
import entregaPercursoSchema from './entregaPercursoSchema';
import { IEntregaPercursoPersistence } from '../../dataschema/IEntregaPercursoPersistence';


const PercursoSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    percurso: { type: String, unique: false },
    tempo: { type: Number, unique: false },
    camiao: {type: String,unique:false},
    entregas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'EntregaPercurso' }],
    dataPercurso: {type: String,unique:false} 
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPercursoPersistence & mongoose.Document>('Percurso', PercursoSchema);
