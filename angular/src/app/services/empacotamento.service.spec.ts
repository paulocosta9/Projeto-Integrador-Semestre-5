import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Empacotamento } from '../empacotamento/empacotamento';

import { EmpacotamentoService } from './empacotamento.service';

describe('CriarEmpacotamentoService', () => {
  let service: EmpacotamentoService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let empacotamentos = [
    {
      id: "123",
      entregaId: "011124",
      posicaoX: 1,
      posicaoY: 2,
      posicaoZ: 3
    },
    {
      id: "124",
      entregaId: "011125",
      posicaoX: 4,
      posicaoY: 5,
      posicaoZ: 6
    }
  ]
  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient',['get','post','put'])
    TestBed.configureTestingModule({providers:[
      EmpacotamentoService,
      {
        provide: HttpClient,
        useValue: httpClientSpyObj,
      }
    ]});
    service = TestBed.inject(EmpacotamentoService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('metodos CRUD',()=>{
    it('deve retornar os empacotamentos quando se faz um getEmpacotamentos', (done: DoneFn)=>{
      httpClientSpy.get.and.returnValue(of(empacotamentos))
      service.getEmpacotamentos().subscribe({
        next: (arms)=>{
          
          expect(arms).toEqual(empacotamentos)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })

    it('deve retornar um empacotamentos quando se faz um getEmpacotamento', (done: DoneFn)=>{
      let emp = empacotamentos[0];
      httpClientSpy.get.and.returnValue(of(emp))
      service.getEmpacotamento("123").subscribe({
        next: (emps)=>{
          expect(emps.id).toEqual(emp.id)
          expect(emps.entregaId).toEqual(emp.entregaId)
          expect(emps.posicaoX).toEqual(emp.posicaoX)
          expect(emps.posicaoY).toEqual(emp.posicaoY)
          expect(emps.posicaoZ).toEqual(emp.posicaoZ)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    })


    it('deve retornar o empacotamento que foi criado', (done: DoneFn)=>{
      let emp = empacotamentos[0];
      httpClientSpy.post.and.returnValue(of(emp))
      service.adicionarEmpacotamento(new Empacotamento("123","011124",1,2,3)).subscribe({
        next: (emps)=>{
          expect(emps.id).toEqual(emp.id)
          expect(emps.entregaId).toEqual(emp.entregaId)
          expect(emps.posicaoX).toEqual(emp.posicaoX)
          expect(emps.posicaoY).toEqual(emp.posicaoY)
          expect(emps.posicaoZ).toEqual(emp.posicaoZ)
          done();
        },
        error: () => {

          done.fail;
        },
          
      })
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);

      
    })

    it('deve atualizar um empacotamento', (done: DoneFn)=>{
      let emp = empacotamentos[0];
      emp.posicaoX = 4;
      httpClientSpy.put.and.returnValue(of(emp))
      service.editarEmpacotamento(new Empacotamento("123","011124",4,2,3)).subscribe({
        next: (emps)=>{
          expect(emps.id).toEqual(emp.id)
          expect(emps.entregaId).toEqual(emp.entregaId)
          expect(emps.posicaoX).toEqual(emp.posicaoX)
          expect(emps.posicaoY).toEqual(emp.posicaoY)
          expect(emps.posicaoZ).toEqual(emp.posicaoZ)
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
