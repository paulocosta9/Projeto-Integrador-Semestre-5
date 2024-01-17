import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Rota } from '../rota/rota';

import { RotaService } from './rota.service';

describe('RotaService', () => {
  let service: RotaService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ROTAS = [
    {
      id: "1304040",
      armazemInicial: "250",
      armazemFinal: "251",
      duracao: 25,
      energiaGasta: 39,
      distancia: 87,
      tempExtra: 10,
    },
    {
      id: "1304041",
      armazemInicial: "252",
      armazemFinal: "253",
      duracao: 30,
      energiaGasta: 50,
      distancia: 40,
      tempExtra: 0,
    }];


  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient',['get','post','put'])
    TestBed.configureTestingModule({providers:[
      RotaService,
      {
        provide: HttpClient,
        useValue: httpClientSpyObj,
      }
    ]});
    service = TestBed.inject(RotaService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('metodos CRUD',()=>{
    it('deve retornar os armazens quando se faz um getArmazens', (done: DoneFn)=>{
      httpClientSpy.get.and.returnValue(of(ROTAS))
      service.getRotas().subscribe({
        next: (rotas)=>{
          
          expect(rotas).toEqual(ROTAS)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })

    it('deve retornar uma rota quando se faz um getRota', (done: DoneFn)=>{
      let arm = ROTAS[0];
      httpClientSpy.get.and.returnValue(of(arm))
      service.getRota("1304040").subscribe({
        next: (rota)=>{
          expect(rota.id).toEqual(arm.id)
          expect(rota.armazemFinal).toEqual(arm.armazemFinal)
          expect(rota.armazemInicial).toEqual(arm.armazemInicial)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })


    it('deve retornar a rota que foi criada', (done: DoneFn)=>{
      let arm = ROTAS[1];
      httpClientSpy.post.and.returnValue(of(arm))
      service.adicionarRota(new Rota("1304041","252","253",30,50,40,0)).subscribe({
        next: (rota)=>{
          expect(rota.id).toEqual(arm.id)
          expect(rota.armazemFinal).toEqual(arm.armazemFinal)
          expect(rota.armazemInicial).toEqual(arm.armazemInicial)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);

      
    })

    it('deve atualizar uma rota', (done: DoneFn)=>{
      let arm = ROTAS[1];
      arm.duracao = 40;
      httpClientSpy.put.and.returnValue(of(arm))
      service.editarRota(new Rota("1304041","252","253",40,50,40,0)).subscribe({
        next: (rota)=>{
          expect(rota.id).toEqual(arm.id)
          expect(rota.armazemFinal).toEqual(arm.armazemFinal)
          expect(rota.armazemInicial).toEqual(arm.armazemInicial)
          expect(rota.duracao).toEqual(arm.duracao)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);

      
    })

    

   

    
  })

  
});
