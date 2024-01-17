import { response } from 'express';
import config from '../../config';
import { Service, Inject } from 'typedi';
import { Result } from '../core/logic/Result';

import IPercursoRepo from '../services/IRepos/IPercursoRepo';
import { Percurso } from "../domain/percurso";
import { PercursoId } from "../domain/percursoId";
import { PercursoMap } from "../mappers/PercursoMap";

import { Document, FilterQuery, Model } from 'mongoose';
import { IPercursoPersistence } from '../dataschema/IPercursoPersistence';


@Service()
export default class PercursoRepo implements IPercursoRepo {

    private models: any;

    constructor(
        @Inject('percursoSchema') private percursoSchema: Model<IPercursoPersistence & Document>,
    ) { }

    private createBaseQuery(): any {
        return {
            where: {},
        }
    }

    public async exists(percurso: Percurso): Promise<boolean> {

        const idX = percurso.id instanceof PercursoId ? (<PercursoId>percurso.id).toValue() : percurso.id;

        const query = { domainId: idX };
        const percursoDocument = await this.percursoSchema.findOne(query as FilterQuery<IPercursoPersistence & Document>);

        return !!percursoDocument === true;
    }

    public async save(percurso: Percurso): Promise<Percurso> {
        const query = { domainId: percurso.id.toString() };
        percurso.percurso = percurso.percurso.toString();
        const percursoDocument = await this.percursoSchema.findOne(query);

        try {
            if (percursoDocument === null) {
                const rawPercurso: any = PercursoMap.toPersistence(percurso);

                const percursoCreated = await this.percursoSchema.create(rawPercurso);

                return PercursoMap.toDomain(percursoCreated);
            } else {
                percursoDocument.percurso = percurso.percurso;
                percursoDocument.tempo = percurso.tempo;
                percursoDocument.entregas = percurso.entregas;
                percursoDocument.camiao = percurso.camiao;
                percursoDocument.dataPercurso = percurso.dataPercurso;
                await percursoDocument.save();

                return percurso;
            }
        } catch (err) {
            throw err;
        }
    }

    public async findAll(): Promise<Percurso[]> {
        const rotaRecord = await this.percursoSchema.find();

        if (rotaRecord != null) {
            var rotaArray = [];
            for (let index = 0; index < rotaRecord.length; ++index) {
                rotaArray[index] = PercursoMap.toDomain(rotaRecord[index]);
            }
            return rotaArray;
        }
        else
            return null;
    }

    public async findAllDataPercurso(dataPercurso: string): Promise<Percurso[]> {
        const query = { dataPercurso: dataPercurso };
        const rotaRecord = await this.percursoSchema.find(query as FilterQuery<IPercursoPersistence & Document>);

        if (rotaRecord != null) {
            var rotaArray = [];
            for (let index = 0; index < rotaRecord.length; ++index) {
                rotaArray[index] = PercursoMap.toDomain(rotaRecord[index]);
            }
            return rotaArray;
        }
        else
            return null;
    }

    public async findAllPercurso(percurso: string, camiao: string, dataPercurso: string): Promise<Percurso[]> {
        percurso = percurso.toString();

        const query = { percurso: percurso, camiao: camiao, dataPercurso: dataPercurso };
        const rotaRecord = await this.percursoSchema.find(query as FilterQuery<IPercursoPersistence & Document>);
        if (rotaRecord != null) {
            var rotaArray = [];
            for (let index = 0; index < rotaRecord.length; ++index) {
                rotaArray[index] = PercursoMap.toDomain(rotaRecord[index]);
            }
            return rotaArray;
        }
        else
            return null;
    }

    async fazerPercurso(json: any): Promise<any> {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': config.planeamento.url + '/percurso',
            'headers': {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(json)
        }
        let result;



        function getPromise(options) {
            return new Promise((resolve, reject) => {
                console.log(options.body)
                request.post(options, function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(response.body)

                        var json = JSON.parse(response.body);
                        resolve(json);
                    }
                })
            });
        }

        async function makeRequest(options) {
            try {
                let promise = getPromise(options);
                let response = await promise;

                result = response;
            } catch (error) {
                console.log(error);
            }
        }
        await (async function () {
            // espera a solicitação http terminar
            await makeRequest(options);
            // o código abaixo será executado após o término da solicitação request

        })();

        return result;
    }


    async fazerHeuristica(json: any, heuristica: string): Promise<any> {

        var request = require('request');
        var options = {
            'method': 'POST',
            'url': config.planeamento.url + '/' + heuristica,
            'headers': {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(json)
        }

        let result;

        function getPromise(options) {
            return new Promise((resolve, reject) => {
                //console.log(options.body)
                request.post(options, function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        //console.log(response.body)

                        var json = JSON.parse(response.body);
                        resolve(json);
                    }
                })
            });
        }

        async function makeRequest(options) {
            try {
                let promise = getPromise(options);
                let response = await promise;

                result = response;
            } catch (error) {
                console.log(error);
            }
        }
        await (async function () {
            // espera a solicitação http terminar
            await makeRequest(options);
            // o código abaixo será executado após o término da solicitação request

        })();

        return result;
    }

    async fazAlgoritmoGenetico(json: any): Promise<any> {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': config.planeamento.url + '/algGenetico',
            'headers': {
                'Content-Type': 'application/json',
            }, body: JSON.stringify(json)
        }
        let result;



        function getPromise(options) {
            return new Promise((resolve, reject) => {
                //console.log(options.body)
                request.post(options, function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        //console.log(response.body)

                        //var json = JSON.parse(response.body);
                        resolve(response.body);
                    }
                })
            });
        }

        async function makeRequest(options) {
            try {
                let promise = getPromise(options);
                let response = await promise;

                result = response;
            } catch (error) {
                console.log(error);
            }
        }
        await (async function () {
            // espera a solicitação http terminar
            await makeRequest(options);
            // o código abaixo será executado após o término da solicitação request

        })();

        return result;
    }



}

