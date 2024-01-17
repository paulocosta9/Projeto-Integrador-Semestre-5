import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { CamiaoService } from 'src/app/services/camiao.service';
import config from 'src/config';
import { Camiao } from '../camiao';


import { EditarCamiaoComponent } from './editar-camiao.component';

describe('EditarCamiaoComponent', () => {
  let component: EditarCamiaoComponent;
  let fixture: ComponentFixture<EditarCamiaoComponent>;
  let camiao: Camiao;
  let mockCamiaoService: any;
  let CAMIOES: Camiao[];
  let CAMIOESINIB: Camiao[];

  beforeEach(async () => {

    CAMIOES = [
      {
        id: "fa07cedd-de05-43c2-b43f-541b95c16a41",
        nome: "eTruck01",
        matricula: "PC-13-BD",
        tara: 7500,
        capacidadeCarga: 4300,
        cargaTotalBat: 80,
        autonomiaCargaMax: 100,
        tempoCarregamento: 60,
        ativo: true
      },

      {
        id: "3343c671-6249-48d7-ac1f-ed88b72f3f14",
        nome: "Felizberto",
        matricula: "12-12-NA",
        tara: 7500,
        capacidadeCarga: 4300,
        cargaTotalBat: 80,
        autonomiaCargaMax: 100,
        tempoCarregamento: 60,
        ativo: true
      }
    ]

    CAMIOESINIB = [
      {
        id: "fa07cedd-de05-43c2-b43f-541b95c16a41",
        nome: "eTruck01",
        matricula: "PC-13-BD",
        tara: 7500,
        capacidadeCarga: 4300,
        cargaTotalBat: 80,
        autonomiaCargaMax: 100,
        tempoCarregamento: 60,
        ativo: true
      },

      {
        id: "3343c671-6249-48d7-ac1f-ed88b72f3f14",
        nome: "Felizberto",
        matricula: "12-12-NA",
        tara: 7500,
        capacidadeCarga: 4300,
        cargaTotalBat: 80,
        autonomiaCargaMax: 100,
        tempoCarregamento: 60,
        ativo: false
      }
    ]

    mockCamiaoService = jasmine.createSpyObj(['editarCamiao', 'listarCamioes', 'listarCamiao', 'inibirCamiao']);

    await TestBed.configureTestingModule({
      providers: [EditarCamiaoComponent, {
        provide: CamiaoService,
        useValue: mockCamiaoService
      }
      ],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [EditarCamiaoComponent]
    })


    fixture = TestBed.createComponent(EditarCamiaoComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarCamioes', () => {

    mockCamiaoService.listarCamioes.and.returnValue(of(CAMIOES));
    component.listarCamioes();
    var cam: any;
    cam = component.camioes;
    var table = new MatTableDataSource(CAMIOES);
    expect(cam.data).toEqual(table.data);


  });
  it('editarCamiao', () => {
    mockCamiaoService.listarCamiao.and.returnValue(of(CAMIOES[1]));
    component.listarCamiao(CAMIOES[1].id);
    camiao = CAMIOES[1];
    camiao.tara = 4535;
    component.camiaoForm.get("tara")?.setValue(4535);
    mockCamiaoService.editarCamiao.and.returnValue(of(camiao));
    expect(component.camiaoForm.valid).toBeTruthy();

    component.submit();
    expect(component.camiao).toEqual(camiao);
    expect(component.success).toBeTruthy();

  });

  it('inibir camiao', () => {
    mockCamiaoService.listarCamiao.and.returnValue(of(CAMIOES[1]));
    mockCamiaoService.listarCamioes.and.returnValue(of(CAMIOESINIB));
    camiao = CAMIOES[1];
    camiao.ativo = false;
    mockCamiaoService.inibirCamiao.and.returnValue(of(camiao));
    CAMIOES[1].ativo = true;
    mockCamiaoService.inibirCamiao.and.returnValue(of(CAMIOES[1]));

    component.inibirCamiao(CAMIOES[1].id);
    expect(component.camiao.ativo).toBeFalse();
    component.inibirCamiao(CAMIOES[1].id);
    expect(component.camiao.ativo).toBeTrue();
  })

  it('verificarDados e validacao do formulario', () => {
    mockCamiaoService.listarCamiao.and.returnValue(of(CAMIOES[1]));

    component.listarCamiao(CAMIOES[1].id);
    camiao = CAMIOES[1];
    camiao.tara = 4561;
    component.camiaoForm.get("tara")?.setValue(4561);
    mockCamiaoService.editarCamiao.and.returnValue(of(camiao));
    expect(component.camiaoForm.valid).toBeTruthy();

    let matricula2 = 'AA-AA-11';
    component.camiaoForm.get('matricula')?.setValue(matricula2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[0]).toEqual(
      'A matrícula ' +
      matricula2 +
      ' não é válida. Tem que estar no formato XX-XX-XX'
    );
    component.camiaoForm.get('matricula')?.setValue(camiao.matricula);

    let tara2 = -7500;
    component.camiaoForm.get('tara')?.setValue(tara2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[1]).toEqual(
      'O valor da tara ' +
      tara2 +
      ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('tara')?.setValue(camiao.tara);

    let capacidadeCarga2 = -4300;
    component.camiaoForm.get('capacidadeCarga')?.setValue(capacidadeCarga2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[2]).toEqual(
      'O valor da capacidade de carga ' +
      capacidadeCarga2 +
      ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('capacidadeCarga')?.setValue(camiao.capacidadeCarga);

    let cargaTotalBat2 = -80;
    component.camiaoForm.get('cargaTotalBat')?.setValue(cargaTotalBat2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[3]).toEqual(
      'O valor da carga total da bateria ' +
      cargaTotalBat2 +
      ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('cargaTotalBat')?.setValue(camiao.cargaTotalBat);

    let autonomiaCargaMax2 = -100;
    component.camiaoForm.get('autonomiaCargaMax')?.setValue(autonomiaCargaMax2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[4]).toEqual(
      'O valor da autonomia da carga máxima ' +
      autonomiaCargaMax2 +
      ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('autonomiaCargaMax')?.setValue(camiao.autonomiaCargaMax);

    let tempoCarregamento2 = -60;
    component.camiaoForm.get('tempoCarregamento')?.setValue(tempoCarregamento2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[5]).toEqual(
      'O valor do tempo de carregamento ' +
      tempoCarregamento2 +
      ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('tempoCarregamento')?.setValue(camiao.tempoCarregamento);

    expect(component.camiaoForm.valid).toBeTruthy();

    component.submit();
    expect(component.camiao).toEqual(camiao);
    expect(component.success).toBeTruthy();

  })
});

describe('EditarCamiaoComponent Integração Com Serviço', () => {
  let component: EditarCamiaoComponent;
  let service: CamiaoService;
  let httpTestingController: HttpTestingController;
  let formBuilder: FormBuilder;
  let CAMIOES: Camiao[];


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCamiaoComponent],
      imports: [HttpClientTestingModule],
      providers: [CamiaoService, FormBuilder]
    })
      .compileComponents();

    CAMIOES = [
      {
        id: "fa07cedd-de05-43c2-b43f-541b95c16a41",
        nome: "eTruck01",
        matricula: "PC-13-BD",
        tara: 7500,
        capacidadeCarga: 4300,
        cargaTotalBat: 80,
        autonomiaCargaMax: 100,
        tempoCarregamento: 60,
        ativo: true
      },

      {
        id: "3343c671-6249-48d7-ac1f-ed88b72f3f14",
        nome: "Felizberto",
        matricula: "12-12-NA",
        tara: 7500,
        capacidadeCarga: 4300,
        cargaTotalBat: 80,
        autonomiaCargaMax: 100,
        tempoCarregamento: 60,
        ativo: true
      }
    ]

    service = TestBed.inject(CamiaoService);
    httpTestingController = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
    component = new EditarCamiaoComponent(formBuilder, service);

  });

  it('deve listar os camioes', () => {

    component.listarCamioes();

    const req = httpTestingController.expectOne(config.logistica.url + "/api/camioes");
    expect(req.request.method).toEqual('GET');
    req.flush(CAMIOES);

    expect(component.camioes.data).toEqual(CAMIOES);


  });

  it('deve listar um camiao e criar um formulario dele e submetê-lo', () => {

    component.listarCamiao(CAMIOES[1].matricula);

    const req = httpTestingController.expectOne(config.logistica.url + "/api/camioes/matricula/" + CAMIOES[1].matricula);
    expect(req.request.method).toEqual('GET');
    req.flush(CAMIOES[1]);

    expect(component.camiao.id).toEqual(CAMIOES[1].id);
    expect(component.camiao.matricula).toEqual(CAMIOES[1].matricula);
    expect(component.camiao.tara).toEqual(CAMIOES[1].tara);
    expect(component.camiao.capacidadeCarga).toEqual(CAMIOES[1].capacidadeCarga);
    expect(component.camiao.cargaTotalBat).toEqual(CAMIOES[1].cargaTotalBat);
    expect(component.camiao.autonomiaCargaMax).toEqual(CAMIOES[1].autonomiaCargaMax);
    expect(component.camiao.tempoCarregamento).toEqual(CAMIOES[1].tempoCarregamento);
    expect(component.camiao.ativo).toEqual(CAMIOES[1].ativo);

    expect(component.camiaoForm.valid).toBeTrue();
    var cam: Camiao = component.camiao;
    cam.tara = 2321;
    component.camiaoForm.controls['tara'].setValue("2321");
    component.submit();

    const req2 = httpTestingController.expectOne(config.logistica.url + "/api/camioes");
    expect(req2.request.method).toEqual('PUT');
    req2.flush(cam);

    expect(component.success).toBeTruthy();

  });

  it('deve inibir um camiao e desinibi-lo', () => {

    component.inibirCamiao(CAMIOES[1].matricula);
    const req = httpTestingController.expectOne(config.logistica.url + '/api/camioes/matricula/' + CAMIOES[1].matricula);
    expect(req.request.method).toEqual('GET');
    var cam: Camiao = CAMIOES[1];
    req.flush(cam);
    expect(component.camiao.ativo).toBeFalse();

    const req2 = httpTestingController.match(config.logistica.url + '/api/camioes/matricula/' + component.camiao.matricula);
    expect(req2[0].request.method).toEqual('PATCH');
    cam.ativo = !cam.ativo;
    req2[0].flush(cam);
    expect(component.camiao.ativo).toBeFalse()

    component.inibirCamiao(CAMIOES[1].matricula);
    const req3 = httpTestingController.match(config.logistica.url + '/api/camioes/matricula/' + component.camiao.matricula);
    expect(req3[0].request.method).toEqual('GET');
    var cam: Camiao = CAMIOES[1];
    req3[0].flush(cam);
    expect(component.camiao.ativo).toBeTrue();

    const req4 = httpTestingController.match(config.logistica.url + '/api/camioes/matricula/' + component.camiao.matricula);
    expect(req4[0].request.method).toEqual('PATCH');
    cam.ativo = !cam.ativo;
    req4[0].flush(cam);
    expect(component.camiao.ativo).toBeTrue()

  });

});