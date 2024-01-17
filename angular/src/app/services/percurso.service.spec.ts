import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Entregas, Percurso } from '../percurso/percurso';

import { PercursoService } from './percurso.service';

describe('PercursoService', () => {
  let service: PercursoService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  
  let ENTREGAS = [

    {
        armazemEntrega: 10,
        entrega: 400
    },
    {
        armazemEntrega: 12,
        entrega: 500
    }

  ]
  let PERCURSOS = [
    {
      percurso: "1 9 8 10 12",
      tempo: 500,
      camiao: "eTruckuck",
      entregas:  ENTREGAS,
      dataPercurso:"20/01/2022"
    },
    {
        percurso: "1 10 2 3 12",
        tempo: 400,
        camiao: "eTruckuck2",
        entregas:  ENTREGAS,
        dataPercurso:"25/04/2022"
    }];


  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient',['get','post','put'])
    TestBed.configureTestingModule({providers:[
      PercursoService,
      {
        provide: HttpClient,
        useValue: httpClientSpyObj,
      }
    ]});
    service = TestBed.inject(PercursoService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('metodos CRUD',()=>{
    it('deve retornar os percurso quando se faz um listarPercursos', (done: DoneFn)=>{
      httpClientSpy.get.and.returnValue(of(PERCURSOS))
      service.listarPercursos().subscribe({
        next: (percursos)=>{
          
          expect(percursos).toEqual(PERCURSOS)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })


  })
 
});
