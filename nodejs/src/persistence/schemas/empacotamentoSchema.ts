import { IEmpacotamentoPersistence } from '../../dataschema/IEmpacotamentoPersistence';
import mongoose from 'mongoose';

const EmpacotamentoSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    entregaId: { type: String, unique: false },
    posicaoX: { type: Number, unique: false },
    posicaoY: { type: Number, unique: false },
    posicaoZ: { type: Number, unique: false },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IEmpacotamentoPersistence & mongoose.Document>('Empacotamento', EmpacotamentoSchema);