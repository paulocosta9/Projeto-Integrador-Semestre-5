import { IUtilizadorPersistence } from '../../dataschema/IUtilizadorPersistence';
import mongoose from 'mongoose';

const UtilizadorSchema = new mongoose.Schema(
  {
    domainId: { type: String, unique: true },
    primeiroNome: { type: String, unique: false },
    ultimoNome: { type: String, unique: false },
    email: { type: String, unique: false },
    cargo: { type: String, unique: false },
    numeroTelemovel: { type: String, unique: false },
    ativo : { type: Boolean , unique: false}
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUtilizadorPersistence & mongoose.Document>('Utilizador', UtilizadorSchema);
