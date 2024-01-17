import { Service, Inject } from 'typedi';
import config from '../../config';
import IEntregaRepo from './IRepos/IEntregaRepo';

import IPercursoService from './IServices/IPercursoService';
import { Result } from '../core/logic/Result';

import IPercursoDTO from '../dto/IPercursoDTO';
import IPercursoResultadoDTO from '../dto/IPercursoDTO';
import IPercursoResultadoBDDTO from '../dto/IPercursoDTO';
import IPercursoResultadoBDDTO2 from '../dto/IPercursoDTO';
import IHeuristicaDTO from '../dto/IPercursoDTO';
import IRotaDTO from '../dto/IRotaDTO';
import IEntregaPercursoDTO from '../dto/IEntregaPercursoDTO';
import IRotaRepo from './IRepos/IRotaRepo';
import ICamiaoRepo from './IRepos/ICamiaoRepo';
import IArmazemRepo from './IRepos/IArmazemRepo';
import IPercursoRepo from './IRepos/IPercursoRepo';

import { Percurso } from '../domain/percurso';
import { EntregaPercurso } from '../domain/entregaPercurso';
import { UniqueEntityID } from '../core/domain/UniqueEntityID';
import { EntregaPercursoMap } from '../mappers/EntregaPercursoMap';
import IEntregaPercursoRepo from './IRepos/IEntregaPercursoRepo';
import { PercursoMap } from '../mappers/PercursoMap';
import IAlgGenDTO from '../dto/IAlgoritmoGeneticoDTO';
import IAlgGenResultDTO from '../dto/IAlgoritmoGeneticoDTO';

@Service()
export default class PercursoService implements IPercursoService {
  @Inject(config.repos.entrega.name) private entregaRepo: IEntregaRepo;
  @Inject(config.repos.rota.name) private rotaRepo: IRotaRepo;
  @Inject(config.repos.camiao.name) private camiaoRepo: ICamiaoRepo;
  @Inject(config.repos.armazem.name) private armazemRepo: IArmazemRepo;
  @Inject(config.repos.percurso.name) private percursoRepo: IPercursoRepo;
  @Inject(config.repos.entregaPercurso.name) private entregaPercursoRepo: IEntregaPercursoRepo;

  numeroMaximoDeEntregas = config.numeroMaximoDeEntregas;
  partidaChegada = config.armazemPartidaChegada;
  entregasPercurso: UniqueEntityID[];

  percentagemCapacidade = config.percentagemDeCapacidade;

  percurso: IPercursoResultadoBDDTO;

  public async fazPercurso(percursoDTO: IPercursoDTO): Promise<Result<IPercursoResultadoDTO>> {
    try {
      var entregas = await this.entregaRepo.findByDate(percursoDTO.data);

      if (entregas.length > this.numeroMaximoDeEntregas) {
        return Result.fail<IPercursoDTO>(entregas.length);
      }

      if (entregas.length == 0) {
        return Result.fail<IPercursoDTO>(entregas.length);
      }

      //console.log(entregas);
      var rotasDasEntregas = [];
      var rota;
      for (var i = 0; i < entregas.length; i++) {
        //console.log(entregas[i].armazemEntrega)
        rota = await this.rotaRepo.findAllArmazemInicial(entregas[i].armazemEntrega);
        for (var j = 0; j < rota.length; j++) {
          rotasDasEntregas.push(rota[j].props);
        }
      }

      rota = await this.rotaRepo.findAllArmazemInicial(this.partidaChegada);
      for (var j = 0; j < rota.length; j++) {
        rotasDasEntregas.push(rota[j].props);
      }

      var camiaoObj = await this.camiaoRepo.findByNome(percursoDTO.nome);

      var camiao = camiaoObj.props;
      camiao.nome = camiao.nome.charAt(0).toLowerCase() + camiao.nome.slice(1)
      console.log(camiao)

      var armazens = await this.armazemRepo.findAll();

      //console.log(armazens);
      var arms = [];
      for (var i = 0; i < armazens.length; i++) {
        arms.push(armazens[i].id);
      }
      //console.log(rotasDasEntregas);

      var obj: any;
      obj = {
        arm: {
          arms: arms,
          pc: this.partidaChegada,
        },

        camiao,
        ent: entregas,
        rotas: rotasDasEntregas,
      };
      console.log(obj)
      var result;
      //console.log(obj);
      result = await this.percursoRepo.fazerPercurso(obj);

      if (result === undefined) {
        return Result.fail<IPercursoDTO>("Nao foi possivel establecer conexao!")
      }

      this.percurso = result;

      this.percurso.camiao = camiao.matricula;
      this.percurso.dataPercurso = percursoDTO.data;
      this.entregasPercurso = [];
      this.percurso.tempo = (Math.round((this.percurso.tempo) * 100) / 100);

      let percursoTemp = await this.percursoRepo.findAllPercurso(
        this.percurso.percurso,
        camiao.matricula,
        percursoDTO.data,
      );
      console.log(percursoTemp.length);
      if (percursoTemp.length == 0) {
        for (let j = 0; j < entregas.length; j++) {
          var entrega = EntregaPercurso.create(entregas[j].armazemEntrega, entregas[j].id).getValue();
          await this.entregaPercursoRepo.save(entrega);
          var f = await this.entregaPercursoRepo.findUIDByDomainId(entrega);
          this.entregasPercurso.push(f);
        }

        this.percurso.entregas = this.entregasPercurso;
        var savable = Percurso.create(this.percurso).getValue();
        //console.log(savable.percurso.toString())
        await this.percursoRepo.save(savable);
        console.log(result);
        return Result.ok<IPercursoDTO>(result);
      }
      return null;

    } catch (e) {
      throw e;
    }

  }

  public async fazHeuristica(percursoDTO: IHeuristicaDTO): Promise<Result<IPercursoDTO>> {
    try {
      var entregas = await this.entregaRepo.findByDate(percursoDTO.data);

      if (entregas.length == 0) {
        return Result.fail<IPercursoDTO>(entregas.length);
      }

      //console.log(entregas);
      var rotasDasEntregas = [];
      var rota;
      for (var i = 0; i < entregas.length; i++) {
        //console.log(entregas[i].armazemEntrega)
        rota = await this.rotaRepo.findAllArmazemInicial(entregas[i].armazemEntrega);
        for (var j = 0; j < rota.length; j++) {
          rotasDasEntregas.push(rota[j].props);
        }
      }

      rota = await this.rotaRepo.findAllArmazemInicial(this.partidaChegada);
      for (var j = 0; j < rota.length; j++) {
        rotasDasEntregas.push(rota[j].props);
      }

      var camiaoObj = await this.camiaoRepo.findByNome(percursoDTO.nome);

      var camiao = camiaoObj.props;

      camiao.nome = camiao.nome.charAt(0).toLowerCase() + camiao.nome.slice(1)
      console.log(camiao)

      var armazens = await this.armazemRepo.findAll();

      //console.log(armazens);
      var arms = [];
      for (var i = 0; i < armazens.length; i++) {
        arms.push(armazens[i].id);
      }
      //console.log(rotasDasEntregas);

      var obj: any;
      obj = {
        arm: {
          arms: arms,
          pc: this.partidaChegada,
        },

        camiao,
        ent: entregas,
        rotas: rotasDasEntregas,
      };

      var percurso;
      //console.log(obj)
      percurso = await this.percursoRepo.fazerHeuristica(obj, percursoDTO.heuristica);
      if (percurso === undefined) {
        return Result.fail<IPercursoDTO>("Nao foi possivel establecer conexao!")
      }
      console.log(percurso);
      //await this.percursoRepo.save(percurso);

      return percurso;
    } catch (e) {
      throw e;
    }
  }

  public async getPercursos(): Promise<Result<IPercursoResultadoBDDTO2[]>> {
    try {
      const percursos = await this.percursoRepo.findAll();
      if (percursos === null) {
        return Result.fail<IPercursoResultadoBDDTO[]>('Nao existem rotas');
      } else {
        var percursoArrayDTO: Array<IPercursoResultadoBDDTO2> = [];
        for (let index = 0; index < percursos.length; ++index) {
          percursoArrayDTO[index] = PercursoMap.toDTO(percursos[index]) as IPercursoResultadoBDDTO2;
        }

        for (let index = 0; index < percursos.length; ++index) {
          let array = new Array();
          for (let i = 0; i < percursos[index].entregas.length; i++) {
            let entreperc: EntregaPercurso = await this.entregaPercursoRepo.findDomainByObjectId(
              percursos[index].entregas[i],
            );

            array.push(entreperc.props);
          }
          percursoArrayDTO[index].entregasObj = array;
        }

        return Result.ok<IPercursoResultadoBDDTO2[]>(percursoArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async getPercursosByData(data: string): Promise<Result<IPercursoResultadoBDDTO2[]>> {
    try {
      const percursos = await this.percursoRepo.findAllDataPercurso(data);
      if (percursos === null) {
        return Result.fail<IPercursoResultadoBDDTO[]>('Nao existem rotas');
      } else {
        var percursoArrayDTO: Array<IPercursoResultadoBDDTO2> = [];
        for (let index = 0; index < percursos.length; ++index) {
          percursoArrayDTO[index] = PercursoMap.toDTO(percursos[index]) as IPercursoResultadoBDDTO2;
        }

        for (let index = 0; index < percursos.length; ++index) {
          let array = new Array();
          for (let i = 0; i < percursos[index].entregas.length; i++) {
            let entreperc: EntregaPercurso = await this.entregaPercursoRepo.findDomainByObjectId(
              percursos[index].entregas[i],
            );

            array.push(entreperc.props);
          }
          percursoArrayDTO[index].entregasObj = array;
        }

        return Result.ok<IPercursoResultadoBDDTO2[]>(percursoArrayDTO);
      }
    } catch (e) {
      throw e;
    }
  }

  public async fazAlgoritmoGenetico(algGenetico: IAlgGenDTO): Promise<Result<IPercursoResultadoBDDTO2[]>> {
    try {
      var entregas = await this.entregaRepo.findByDate(algGenetico.data);

      if (entregas.length == 0) {
        return Result.fail<IPercursoResultadoBDDTO2[]>('Não existem entregas para esse dia.');
      }
      var rotasDasEntregas = [];
      var rota;

      var massaTotalDasEntregas = 0;
      //Rotas de armazens das entregas
      for (var i = 0; i < entregas.length; i++) {
        //console.log(entregas[i].armazemEntrega)
        massaTotalDasEntregas += entregas[i].massaEntrega;
        rota = await this.rotaRepo.findAllArmazemInicial(entregas[i].armazemEntrega);
        for (var j = 0; j < rota.length; j++) {
          rotasDasEntregas.push(rota[j].props);
        }
      }

      rota = await this.rotaRepo.findAllArmazemInicial(this.partidaChegada);
      for (var j = 0; j < rota.length; j++) {
        rotasDasEntregas.push(rota[j].props);
      }
      var armazens = await this.armazemRepo.findAll();

      //Armazens ativos presentes nas entregas
      var arms = [];
      for (var i = 0; i < armazens.length; i++) {
        if (armazens[i].active) {
          for (var j = 0; j < entregas.length; j++) {
            if (armazens[i].id == entregas[j].armazemEntrega) {
              arms.push(armazens[i].id);
            }
          }
        }
      }

      //console.log(arms);

      var camioes = [];
      var camiaoObj = await this.camiaoRepo.findAll();
      var pesoCamiao = camiaoObj[0].capacidadeCarga;

      let numeroDeCamioes = massaTotalDasEntregas / (pesoCamiao * this.percentagemCapacidade);

      //Para não exceder o limite e ter uma margem
      if (numeroDeCamioes % 1 > this.percentagemCapacidade) {
        numeroDeCamioes += 1;
      }

      numeroDeCamioes = Math.ceil(numeroDeCamioes);

      console.log(numeroDeCamioes);
      //console.log(camiao)

      if (numeroDeCamioes > camiaoObj.length) {
        return Result.fail<IPercursoResultadoBDDTO2[]>(
          'Não existem camiões suficientes. São precisos mais ' + (numeroDeCamioes - camiaoObj.length) + ' camiões.',
        );
      }

      for (var i = 0; i < numeroDeCamioes; i++) {
        var cam = camiaoObj.pop();
        cam.nome = cam.nome.charAt(0).toLowerCase() + cam.nome.slice(1);
        camioes.push(cam.props);
      }

      //console.log(rotasDasEntregas);

      var obj: any;
      obj = {
        arm: {
          arms: arms,
          pc: this.partidaChegada,
        },

        camioes,

        ent: entregas,
        rotas: rotasDasEntregas,
        numero_geracoes: algGenetico.numero_geracoes,
        dimensao_populacao: algGenetico.dimensao_populacao,
        prob_cruzamento: algGenetico.prob_cruzamento,
        prob_mutacao: algGenetico.prob_mutacao,
        valor_minimo: algGenetico.valor_minimo,
      };

      var result;
      result = await this.percursoRepo.fazAlgoritmoGenetico(obj);
      result = result.split('\n\n\n');
      var size = result.length;
      if (size == 2) {
        return Result.fail<IPercursoResultadoBDDTO2[]>(result[1]); //Numero maximo de geracoes
      }
      var percursos = [];
      for (var i = 1; i < size - 2; i++) {
        //Nao precisamos da ultima msg
        percursos.push(result[i]);
      }
      //Custos de cada percurso Trabalho da String
      var custos = result[size - 1];
      custos = custos.replace('[', '');
      custos = custos.replace(']', '');
      custos = custos.replace('\n', '');
      //console.log(custos)

      custos = custos.replaceAll(',O melhor percurso para o camiao ,', '!');
      custos = custos.replaceAll('O melhor percurso para o camiao ,', '');
      custos = custos.replaceAll(', e: ,', '?[');
      custos = custos.replaceAll(', com o custo de: ,', ']?');
      custos = custos.split('!');
      //console.log(custos)

      var resultForReturn = [];
      //Persistência dos Percursos
      console.log(custos)
      var percursoDTO;
      percursoDTO = { percurso: '8,1', tempo: 88, camiao: 'aaa', dataPercurso: '2' };

      for (var i = 0; i < custos.length; i++) {
        var objetoPercursoResultado = custos[i].split('?');

        objetoPercursoResultado[1] = objetoPercursoResultado[1].replace('[', '');
        objetoPercursoResultado[1] = objetoPercursoResultado[1].replace(']', '');

        var camiaoNome = objetoPercursoResultado[0].charAt(0).toUpperCase() + objetoPercursoResultado[0].slice(1);


        percursoDTO.camiao = (await this.camiaoRepo.findByNome(camiaoNome)).matricula;
        percursoDTO.dataPercurso = algGenetico.data;
        percursoDTO.percurso = objetoPercursoResultado[1];
        percursoDTO.tempo = (Math.round((objetoPercursoResultado[2]) * 100) / 100).toFixed(2);
        var entregasPercurso = [];

        console.log(percursoDTO.camiao);
        let percursoTemp = await this.percursoRepo.findAllPercurso(
          percursoDTO.percurso,
          percursoDTO.camiao,
          algGenetico.data,
        );

        //console.log(percursoDTO)
        //console.log(percursoTemp)

        console.log(percursoTemp.length);
        if (percursoTemp.length == 0) {
          var armazensParaPercurso = percursoDTO.percurso.split(',');
          console.log(armazensParaPercurso);
          var idEntregas = [];

          //Saber os ids das entregas de cada armazem
          for (var k = 0; k < armazensParaPercurso.length; k++) {
            for (var j = 0; j < entregas.length; j++) {
              if (parseInt(entregas[j].armazemEntrega) == parseInt(armazensParaPercurso[k])) {
                idEntregas.push(parseInt(entregas[j].id));
                var entrega = EntregaPercurso.create(entregas[j].armazemEntrega, entregas[j].id).getValue();
                await this.entregaPercursoRepo.save(entrega);
                var f = await this.entregaPercursoRepo.findUIDByDomainId(entrega);
                entregasPercurso.push(f);
              }
            }
          }

          percursoDTO.entregas = entregasPercurso;
          var savable = Percurso.create(percursoDTO).getValue();
          //console.log(savable.percurso.toString())
          await this.percursoRepo.save(savable);

          var returnable = savable.props;
          returnable.entregas = idEntregas;
          resultForReturn.push(returnable);
        }
      }

      return Result.ok<IPercursoResultadoBDDTO2[]>(resultForReturn);
    } catch (e) {
      throw e;
    }
  }

  public async mockPlanning(percursoDTO: IPercursoDTO): Promise<Result<IPercursoResultadoBDDTO2>> {
    var entregas = await this.entregaRepo.findByDate(percursoDTO.data);
    var sortedEntregas = entregas.sort((n1, n2) => n1.massaEntrega - n2.massaEntrega);

    var rotasDasEntregas = [];
    var rota;

    for (var i = 0; i < sortedEntregas.length - 1; i++) {
      //console.log(entregas[i].armazemEntrega)
      rota = await this.rotaRepo.findAllArmazemInicialFinal(
        sortedEntregas[i].armazemEntrega,
        sortedEntregas[i + 1].armazemEntrega,
      );
      rotasDasEntregas.push(rota[0].props);
    }
    var rotaInicial = await this.rotaRepo.findAllArmazemInicialFinal(
      this.partidaChegada,
      rotasDasEntregas[0].armazemInicial,
    );

    var rotaFinal = await this.rotaRepo.findAllArmazemInicialFinal(
      rotasDasEntregas[rotasDasEntregas.length - 1].armazemFinal,
      this.partidaChegada,
    );

    rotasDasEntregas.push(rotaFinal[0].props);
    rotasDasEntregas.unshift(rotaInicial[0].props);

    var camiaoObj = await this.camiaoRepo.findByNome(percursoDTO.nome);

    var camiao = camiaoObj.props;

    var pesoCamiao = camiao.tara;
    var bateria = camiao.cargaTotalBat;
    var pesoMaximo = camiao.tara + camiao.capacidadeCarga;

    for (var i = 0; i < sortedEntregas.length - 1; i++) {
      pesoCamiao += sortedEntregas[i].massaEntrega;
    }

    var tempoTotal = 0;
    for (var i = 0; i < rotasDasEntregas.length - 1; i++) {
      var duracaoViagem = (rotasDasEntregas[i].duracao * pesoCamiao) / pesoMaximo;
      tempoTotal += duracaoViagem;
      var tempoDescarregamento;
      for (var j = 0; j < sortedEntregas.length - 1; j++) {
        if (sortedEntregas[j].armazemEntrega == rotasDasEntregas[i].armazemFinal) {
          tempoDescarregamento = sortedEntregas[j].tempoDescarregarEntrega;
          tempoTotal += tempoDescarregamento;
          pesoCamiao -= sortedEntregas[j].massaEntrega;
        }
      }
    }
    console.log('Tempo Total Final: ' + tempoTotal);
    var mockDTO;
    mockDTO = { percurso: '8,1', tempo: 88, camiao: 'aaa', dataPercurso: '2' };

    mockDTO.camiao = camiao.matricula;
    mockDTO.dataPercurso = percursoDTO.data;
    var armazensEntrega: string[] = []
    for (var y = 0; y < sortedEntregas.length; y++) {
      armazensEntrega[y] = parseInt(sortedEntregas[y].armazemEntrega).toString();
    }
    mockDTO.percurso = armazensEntrega.toString();
    mockDTO.tempo = tempoTotal;

    var entregasPercurso = [];
    for (let j = 0; j < sortedEntregas.length; j++) {
      var entrega = EntregaPercurso.create(sortedEntregas[j].armazemEntrega, sortedEntregas[j].id).getValue();
      await this.entregaPercursoRepo.save(entrega);
      var f = await this.entregaPercursoRepo.findUIDByDomainId(entrega);
      entregasPercurso.push(f);
    }

    mockDTO.entregas = entregasPercurso;

    var savable = Percurso.create(mockDTO).getValue();
    await this.percursoRepo.save(savable);

    return Result.ok<IPercursoResultadoBDDTO2>(mockDTO);
  }
}
