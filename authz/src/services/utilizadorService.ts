import { Service, Inject } from 'typedi';
import config from "../../config";
import IUtilizadorDTO from '../dto/IUtilizadorDTO';
import { Utilizador } from "../domain/utilizador";
import IUtilizadorRepo from './IRepos/IUtilizadorRepo';
import IUtilizadorService from './IServices/IUtilizadorService';
import { Result } from "../core/logic/Result";
import { UtilizadorMap } from "../mappers/UtilizadorMap";
const jwt = require('jsonwebtoken');
const fs = require('fs');
@Service()
export default class UtilizadorService implements IUtilizadorService {
  constructor(
    @Inject(config.repos.utilizador.name) private utilizadorRepo: IUtilizadorRepo
  ) { }

  public async getUtilizador(utilizadorId: string): Promise<Result<IUtilizadorDTO>> {
    try {
      const utilizador = await this.utilizadorRepo.findByDomainId(utilizadorId);

      if (utilizador === null) {
        return Result.fail<IUtilizadorDTO>("Utilizador nao encontrado");
      }
      else {
        const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;
        return Result.ok<IUtilizadorDTO>(utilizadorDTOResult)
      }
    } catch (e) {
      throw e;
    }
  }

  public async getUtilizadores(): Promise<Result<IUtilizadorDTO[]>> {
    try {
      const utilizadores = await this.utilizadorRepo.findAll();

      if (utilizadores === null) {
        return Result.fail<IUtilizadorDTO[]>("[!] Não existem Utilizadores [!]");
      }
      else {

        var utilizadorArrayDTO: Array<IUtilizadorDTO> = [];
        for (let index = 0; index < utilizadores.length; ++index) {
          utilizadorArrayDTO[index] = UtilizadorMap.toDTO(utilizadores[index]) as IUtilizadorDTO;

        }
        return Result.ok<IUtilizadorDTO[]>(utilizadorArrayDTO)
      }
    } catch (e) {
      throw e;
    }
  }

  public async createUtilizador(utilizadorDTO: IUtilizadorDTO): Promise<Result<IUtilizadorDTO>> {
    try {
      const utilizadorOrError = await Utilizador.create(utilizadorDTO);

      if (utilizadorOrError.isFailure) {
        return Result.fail<IUtilizadorDTO>(utilizadorOrError.errorValue());
      }

      const utilizadorResult = utilizadorOrError.getValue();
      utilizadorResult.ativo = true;
      await this.utilizadorRepo.save(utilizadorResult);

      const camiaoDTOResult = UtilizadorMap.toDTO(utilizadorResult) as IUtilizadorDTO;
      return Result.ok<IUtilizadorDTO>(camiaoDTOResult)
    } catch (e) {
      throw e;
    }
  }

  public async updateUtilizador(utilizadorDTO: IUtilizadorDTO): Promise<Result<IUtilizadorDTO>> {
    try {
      const utilizador = await this.utilizadorRepo.findByEmail(utilizadorDTO.email);

      if (utilizador === null) {
        return Result.fail<IUtilizadorDTO>("Utilizador nao encontrado");
      }
      else {

        utilizador.primeiroNome = utilizadorDTO.primeiroNome;
        utilizador.ultimoNome = utilizadorDTO.ultimoNome;
        utilizador.email = "???";
        utilizador.numeroTelemovel = utilizadorDTO.numeroTelemovel;
        utilizador.cargo = utilizadorDTO.cargo;
        utilizador.ativo = false;
        await this.utilizadorRepo.save(utilizador);

        const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;
        return Result.ok<IUtilizadorDTO>(utilizadorDTOResult)
      }
    } catch (e) {
      throw e;
    }
  }


  public async getByEmail(email: string): Promise<Result<IUtilizadorDTO>> {

    try {
      const utilizador = await this.utilizadorRepo.findByEmail(email);

      if (utilizador === null) {
        return Result.fail<IUtilizadorDTO>("Utilizador nao encontrado");
      }
      else {
        const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;
        return Result.ok<IUtilizadorDTO>(utilizadorDTOResult)
      }

    } catch (e) {
      throw e;
    }
  }

  public async getByNumeroTelemovel(numeroTelemovel: string): Promise<Result<IUtilizadorDTO>> {

    try {
      const utilizador = await this.utilizadorRepo.findByNumeroTelemovel(numeroTelemovel);

      if (utilizador === null) {
        return Result.fail<IUtilizadorDTO>("Utilizador nao encontrado");
      }
      else {
        const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;
        return Result.ok<IUtilizadorDTO>(utilizadorDTOResult)
      }

    } catch (e) {
      throw e;
    }
  }

  public async getUsers(): Promise<Result<IUtilizadorDTO[]>> {
    try {
      const rotas = await this.utilizadorRepo.findAll();

      if (rotas === null) {
        return Result.fail<IUtilizadorDTO[]>('Nao existem rotas');
      } else {
        var rotaArrayDTO: Array<IUtilizadorDTO> = [];
        for (let index = 0; index < rotas.length; ++index) {
          rotaArrayDTO[index] = UtilizadorMap.toDTO(rotas[index]) as IUtilizadorDTO;
        }
        return Result.ok<IUtilizadorDTO[]>(rotaArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getAccessToken(email: string): Promise<Result<IUtilizadorDTO>> {

    try {
      const utilizador = await this.utilizadorRepo.findByEmail(email);

      if (utilizador === null) {
        return Result.fail<IUtilizadorDTO>("Utilizador nao encontrado");
      }
      else {
        //const crypto = require('crypto');
        const jwt = require('jsonwebtoken');

        /* const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
           namedCurve: 'secp256k1',
           publicKeyEncoding: {
             type: 'spki',
             format: 'pem'
           },
           privateKeyEncoding: {
             type: 'pkcs8',
             format: 'pem'
           }
         });
 
         console.log(publicKey);
         console.log(privateKey);
 
         fs.writeFileSync('./public.key', publicKey);
         fs.writeFileSync('./private.key', privateKey);*/

        // Define the payload for the JWT
        const utilizadorDTOResult = UtilizadorMap.toDTO(utilizador) as IUtilizadorDTO;

        const payload = {
          primeiroNome: utilizadorDTOResult.primeiroNome,
          ultimoNome: utilizadorDTOResult.ultimoNome,
          email: utilizadorDTOResult.email,
          numeroTelemovel: utilizadorDTOResult.numeroTelemovel,
          cargo: utilizadorDTOResult.cargo,

        };

        // Sign the JWT using the private key

        const privateKey = fs.readFileSync('./private.key', 'utf8');
        const publicKey = fs.readFileSync('./public.key', 'utf8');
        const accessToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' });


        try {
          const verified = jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
          //console.log(verified);
        } catch (error) {
          console.error(error);
        }


        //console.log(accessToken)

        return Result.ok<IUtilizadorDTO>(accessToken)
      }

    } catch (e) {
      throw e;
    }
  }

}
