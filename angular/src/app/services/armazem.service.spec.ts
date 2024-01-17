import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Armazem, Coordenadas, Endereco } from '../armazem/armazem';

import { ArmazemService } from './armazem.service';

describe('CriarArmazemService', () => {
  let service: ArmazemService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let ARMAZENS = [
    {
      id: "001",
      designacao: "Maia",
      end: {
        rua: "Rua",
        cidade: "Porto",
        codigo_postal: "3333-333",
        pais: "Portugal",
        porta: 22,
      },
      coord: {
        latitude: 33.3,
        longitude: 22.2,
        altitude: 100
      },
      active:true
    },
    {
      id: "999",
      designacao: "Mais",
      end: {
        rua: "Av",
        cidade: "Porta",
        codigo_postal: "3333-333",
        pais: "Portugal",
        porta: 22,
      },
      coord: {
        latitude: 33.3,
        longitude: 22.2,
        altitude: 100
      },
      active:true
    },
    {
      id: "121",
      designacao: "Mai",
      end: {
        rua: "Viela",
        cidade: "Porto",
        codigo_postal: "3333-333",
        pais: "Portugal",
        porta: 22,
      },
      coord: {
        latitude: 33.3,
        longitude: 22.2,
        altitude: 100
      },
      active:true
    }
  ]
  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient',['get','post','put'])
    TestBed.configureTestingModule({providers:[
      ArmazemService,
      {
        provide: HttpClient,
        useValue: httpClientSpyObj,
      }
    ]});
    service = TestBed.inject(ArmazemService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('metodos CRUD',()=>{
    it('deve retornar os armazens quando se faz um getArmazens', (done: DoneFn)=>{
      httpClientSpy.get.and.returnValue(of(ARMAZENS))
      service.listarArmazens().subscribe({
        next: (arms)=>{
          
          expect(arms).toEqual(ARMAZENS)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })

    it('deve retornar um armazen quando se faz um getArmazem', (done: DoneFn)=>{
      let arm = ARMAZENS[1];
      httpClientSpy.get.and.returnValue(of(arm))
      service.listarArmazem("999").subscribe({
        next: (arms)=>{
          expect(arms.id).toEqual(arm.id)
          expect(arms.coord).toEqual(arm.coord)
          expect(arms.designacao).toEqual(arm.designacao)
          expect(arms.end).toEqual(arm.end)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })


    it('deve retornar o armazem que foi criado', (done: DoneFn)=>{
      let arm = ARMAZENS[2];
      httpClientSpy.post.and.returnValue(of(arm))
      service.adicionarArmazem(new Armazem("121",new Endereco("Viela","Porto","3333-333","Portugal",22),"Mai", new Coordenadas(33.3,22.2,100),true)).subscribe({
        next: (arms)=>{
          expect(arms.id).toEqual(arm.id)
          expect(arms.coord).toEqual(arm.coord)
          expect(arms.designacao).toEqual(arm.designacao)
          expect(arms.end).toEqual(arm.end)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);

      
    })

    it('deve atualizar um armazem', (done: DoneFn)=>{
      let arm = ARMAZENS[2];
      arm.end.rua = "Vi";
      httpClientSpy.put.and.returnValue(of(arm))
      service.editarArmazem(new Armazem("121",new Endereco("Vi","Porto","3333-333","Portugal",22),"Mai", new Coordenadas(33.3,22.2,100),true)).subscribe({
        next: (arms)=>{
          expect(arms.id).toEqual(arm.id)
          expect(arms.coord).toEqual(arm.coord)
          expect(arms.designacao).toEqual(arm.designacao)
          expect(arms.end).toEqual(arm.end)
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
