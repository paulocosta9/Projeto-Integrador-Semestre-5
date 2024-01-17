import { IRotaPersistence } from '../../dataschema/IRotaPersistence';
import mongoose from 'mongoose';

const RotaSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    armazemInicial: {type: String,unique:false},
    armazemFinal: {type: String,unique:false},
    duracao: {type: Number,unique:false},
    energiaGasta : {type: Number,unique:false},
    distancia : {type: Number,unique:false},
    tempExtra : {type: Number,unique:false}
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IRotaPersistence & mongoose.Document>('Rota', RotaSchema);
