import { ICamiaoPersistence } from '../../dataschema/ICamiaoPersistence';
import mongoose from 'mongoose';

const CamiaoSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    nome: { type: String, unique: true },
    matricula: { type: String, unique: true },
    tara: { type: Number, unique: false },
    capacidadeCarga: { type: Number, unique: false },
    cargaTotalBat: { type: Number, unique: false },
    autonomiaCargaMax: { type: Number, unique: false },
    tempoCarregamento: { type: Number, unique: false },
    ativo: {type: Boolean, unique: false}

  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICamiaoPersistence & mongoose.Document>('Camiao', CamiaoSchema);
