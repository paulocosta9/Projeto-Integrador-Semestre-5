import { response } from 'express';
import { Service, Inject } from 'typedi';
import config from '../../config';
import { Result } from '../core/logic/Result';

import IEntregaRepo from '../services/IRepos/IEntregaRepo';



@Service()
export default class EntregaRepo implements IEntregaRepo {
   
  
    public async exists(entregaId: String): Promise<Boolean> {
    
    var request = require('request');
    var options = {
    'url': config.gestaoArmazens.url+'/api/entrega/'+entregaId,
    'headers': {
    },
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
    };

    let result = false;
    

    function getPromise(options){
        return new Promise((resolve, reject) => {
           request.get(options,function (error, response) {
                if (error) {
                    reject(error);
                } else{
                var json = JSON.parse(response.body);
                resolve(json.id);
            }
           })
        });
    }

    async function makeRequest(options) {
        try{
            let promise = getPromise(options);
            let response = await promise;
            console.log(response);
            if(response != null){
                result = true;
                console.log(result);
            }else{
                result = false;
            }
        }catch(error){
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

  

  public async findByDate(data: String): Promise<any> {
    
    var request = require('request');
    var options = {
    'url': config.gestaoArmazens.url+'/api/entrega/data/'+data,
    'headers': {
    },
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
    };

    let result: any;
    

    function getPromise(options){
        return new Promise((resolve, reject) => {
           request.get(options,function (error, response) {
                if (error) {
                    reject(error);
                } else{
                var json = JSON.parse(response.body);
                
                resolve(json);
            }
           })
        });
    }

    async function makeRequest(options) {
        try{
            let promise = getPromise(options);
            let response = await promise;
            result = response;
            
        }catch(error){
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

