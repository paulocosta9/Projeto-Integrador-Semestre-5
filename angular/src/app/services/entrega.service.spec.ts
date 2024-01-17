import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Entrega } from '../entrega/entrega';

import { EntregaService } from './entrega.service';

describe('CriarEntregaService', () => {
  let service: EntregaService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let Entregas = [
    {
      dataEntrega: '17-12-2028',
      massaEntrega: 12,
      armazemEntrega: '002',
      tempoCarregarEntrega: 12,
      tempoDescarregarEntrega: 12,

      id: '011124',
    },
    {
      dataEntrega: '17-02-2029',
      massaEntrega: 12,
      armazemEntrega: '102',
      tempoCarregarEntrega: 11,
      tempoDescarregarEntrega: 12,

      id: '211124',
    },
    {
      dataEntrega: '17-12-2623',
      massaEntrega: 12,
      armazemEntrega: '712',
      tempoCarregarEntrega: 12,
      tempoDescarregarEntrega: 12,

      id: '842124',
    },
  ];
  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
    ]);
    TestBed.configureTestingModule({
      providers: [
        EntregaService,
        {
          provide: HttpClient,
          useValue: httpClientSpyObj,
        },
      ],
    });
    service = TestBed.inject(EntregaService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Metodos CRUD', () => {
    it('Deve retornar as entregas quando se faz um listarEntregas', (done: DoneFn) => {
      httpClientSpy.get.and.returnValue(of(Entregas));
      service.listarEntregas().subscribe({
        next: (entrs) => {
          expect(entrs).toEqual(Entregas);
          done();
        },
        error: () => {
          done.fail;
        },
      });
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar uma entrega quando se faz um listarEntrega', (done: DoneFn) => {
      let entrega = Entregas[0];
      httpClientSpy.get.and.returnValue(of(entrega));
      service.listarEntrega('011124').subscribe({
        next: (entrs) => {
          expect(entrs.id).toEqual(entrega.id);
          expect(entrs.armazemEntrega).toEqual(entrega.armazemEntrega);
          expect(entrs.dataEntrega).toEqual(entrega.dataEntrega);
          expect(entrs.tempoCarregarEntrega).toEqual(
            entrega.tempoCarregarEntrega
          );
          expect(entrs.tempoDescarregarEntrega).toEqual(
            entrega.tempoDescarregarEntrega
          );
          done();
        },
        error: () => {
          done.fail;
        },
      });
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    it('Deve retornar a entrega que foi criada', (done: DoneFn) => {
      let arm = Entregas[2];
      httpClientSpy.post.and.returnValue(of(arm));
      service
        .adicionarEntrega(
          new Entrega('842124', '712', '2623-12-17', 12, 12, 12)
        )
        .subscribe({
          next: (entrs) => {
            expect(entrs.id).toEqual(arm.id);
            expect(entrs.armazemEntrega).toEqual(arm.armazemEntrega);
            expect(entrs.dataEntrega).toEqual(arm.dataEntrega);
            expect(entrs.tempoCarregarEntrega).toEqual(
              arm.tempoCarregarEntrega
            );
            expect(entrs.tempoDescarregarEntrega).toEqual(
              arm.tempoDescarregarEntrega
            );
            done();
          },
          error: () => {
            done.fail;
          },
        });
    });

    it('Deve atualizar uma entrega', (done: DoneFn) => {
      let entrega = Entregas[1];
      entrega.tempoCarregarEntrega = 27;
      httpClientSpy.put.and.returnValue(of(entrega));
      service
        .editarEntrega(new Entrega('211124', '102', '2029-02-17', 12, 27, 12))
        .subscribe({
          next: (entrs) => {
            expect(entrs.id).toEqual(entrega.id);
            expect(entrs.armazemEntrega).toEqual(entrega.armazemEntrega);
            expect(entrs.dataEntrega).toEqual(entrega.dataEntrega);
            expect(entrs.tempoCarregarEntrega).toEqual(
              entrega.tempoCarregarEntrega
            );
            expect(entrs.tempoDescarregarEntrega).toEqual(
              entrega.tempoDescarregarEntrega
            );
            done();
          },
          error: () => {
            done.fail;
          },
        });
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
  });
});
