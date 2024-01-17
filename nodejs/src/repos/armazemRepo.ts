import { response } from 'express';
import { Service, Inject } from 'typedi';
import config from '../../config';
import { Result } from '../core/logic/Result';
import IArmazemRepo from '../services/IRepos/IArmazemRepo';



@Service()
export default class ArmazemRepo implements IArmazemRepo {
  
    public async exists(armazemId: String): Promise<Boolean> {
    
    var request = require('request');
    var options = {
    'url': config.gestaoArmazens.url+'/api/armazem/'+armazemId,
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
            
            if(response != null){
                result = true;
                
            }else{
                result = false;
            }
        }catch(error){
            console.log(error);
        }
    }
    await (async function () {
        // wait to http request to finish
        await makeRequest(options);
        // below code will be executed after http request is finished

    })();
    
    return result;
  }


  public async findAll(): Promise<any> {
    
    var request = require('request');
    var options = {
    'url': config.gestaoArmazens.url+'/api/armazem',
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
        // wait to http request to finish
        await makeRequest(options);
        // below code will be executed after http request is finished

    })();
    
    return result;
  }
  
}