import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { ArmazemService } from 'src/app/services/armazem.service';
import config from 'src/config';
import { Armazem, Inibir } from '../armazem';


import { EditarArmazemComponent } from './editar-armazem.component';

describe('EditarArmazemComponent', () => {
  let component: EditarArmazemComponent;
  let fixture: ComponentFixture<EditarArmazemComponent>;
  let armazem: Armazem;
  let mockArmazemService: any;
  let ARMAZENS: Armazem[];
  let ARMAZENSINIB: Armazem[];

  beforeEach(async () => {

    ARMAZENS = [
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
        active: true
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
        active: true
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
        active: true
      }
    ]

    ARMAZENSINIB = [
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
        active: true
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
        active: true
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
        active: false
      }
    ]

    mockArmazemService = jasmine.createSpyObj(['editarArmazem', 'listarArmazens', 'listarArmazem', 'inibirArmazem']);

    await TestBed.configureTestingModule({
      providers: [EditarArmazemComponent, {
        provide: ArmazemService,
        useValue: mockArmazemService
      }
      ],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [EditarArmazemComponent]
    })


    fixture = TestBed.createComponent(EditarArmazemComponent);
    component = fixture.componentInstance;

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarArmazens', () => {

    mockArmazemService.listarArmazens.and.returnValue(of(ARMAZENS));
    component.listarArmazens();
    var arm: any;
    arm = component.armazens
    var table = new MatTableDataSource(ARMAZENS);
    expect(arm.data).toEqual(table.data);


  });
  it('editarArmazem', () => {
    mockArmazemService.listarArmazem.and.returnValue(of(ARMAZENS[2])); //Criar o mock do metodo

    component.getArmazem(ARMAZENS[2].id); //chama o metodo que usa o mock
    armazem = ARMAZENS[2];
    armazem.designacao = "MAIA";
    component.armazemForm.get("designacao")?.setValue("MAIA"); //Edita o valor do formulario
    mockArmazemService.editarArmazem.and.returnValue(of(armazem)); //Cria o mock do metodo
    expect(component.armazemForm.valid).toBeTruthy(); //Esperas que continue valido

    component.submit();
    expect(component.armazem).toEqual(armazem); //Esperas que retorne o armazem editado
    expect(component.success).toBeTruthy();



  });

  it('inibir armazem', () => {
    mockArmazemService.listarArmazem.and.returnValue(of(ARMAZENS[2])) //Mock da listagem de armazem
    mockArmazemService.listarArmazens.and.returnValue(of(ARMAZENSINIB)) //Mock da listagem final dos varios armazens
    armazem = ARMAZENS[2]
    armazem.active = false //Mudar o valor do armazem retorno que comeca a true por isso deve acabar como falso na primeira chamada
    mockArmazemService.inibirArmazem.and.returnValue(of(armazem))
    ARMAZENS[2].active = true
    mockArmazemService.inibirArmazem.and.returnValue(of(ARMAZENS[2]))


    component.inibirArmazem(ARMAZENS[2].id) //Retorna falso
    //component.inibirArmazem(ARMAZENS[2].id)
    //console.log(component.armazem)
    expect(component.armazem.active).toBeFalse()
    component.inibirArmazem(ARMAZENS[2].id)//Retorna verdadeiro
    expect(component.armazem.active).toBeTrue()
  })

  it('verificarDados e validacao do formulario', () => {
    mockArmazemService.listarArmazem.and.returnValue(of(ARMAZENS[2])); //Criar o mock do metodo

    component.getArmazem(ARMAZENS[2].id); //chama o metodo que usa o mock
    armazem = ARMAZENS[2];
    armazem.designacao = "MAIA";
    component.armazemForm.get("designacao")?.setValue("MAIA"); //Edita o valor do formulario
    mockArmazemService.editarArmazem.and.returnValue(of(armazem)); //Cria o mock do metodo
    expect(component.armazemForm.valid).toBeTruthy();


    component.armazemForm.get('id')?.setValue("sss");

    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[0]).toEqual("Id sss não é válido tem de ser 3 caracteres numéricos")

    component.armazemForm.get('id')?.setValue(armazem.id);
    component.armazemForm.get('end.codigo_postal')?.setValue("SSSS-333");

    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[1]).toEqual("Código Postal SSSS-333 não é válido. Tem de ser no formato : XXXX-XXX (X é um número inteiro)")

    component.armazemForm.get('end.codigo_postal')?.setValue(armazem.end.codigo_postal);
    component.armazemForm.get('end.porta')?.setValue("s");

    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[2]).toEqual("Número de Porta s não é válido tem de ser um valor numérico")

    component.armazemForm.get('end.porta')?.setValue(armazem.end.porta);
    component.armazemForm.get('coord.latitude')?.setValue("s");

    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[3]).toEqual("Latitude s não é válida tem de ser um valor numérico entre -90 e 90 (exclusive)")

    component.armazemForm.get('coord.latitude')?.setValue(armazem.coord.latitude);
    component.armazemForm.get('coord.longitude')?.setValue("s");

    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[4]).toEqual("Longitude s não é válida tem de ser um valor numérico entre -180 e 180 (exclusive)")

    component.armazemForm.get('coord.longitude')?.setValue(armazem.coord.longitude);
    component.armazemForm.get('coord.altitude')?.setValue("s");

    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[5]).toEqual("Altitude s não é válida tem de ser um valor numérico")

    component.armazemForm.get('coord.altitude')?.setValue(armazem.coord.altitude);

    expect(component.armazemForm.valid).toBeTruthy();

    component.submit();
    expect(component.armazem).toEqual(armazem); //Esperas que retorne o armazem editado
    expect(component.success).toBeTruthy();

  })
});

describe('EditarArmazemComponent Integração Com Serviço', () => {
  let component: EditarArmazemComponent;
  let service: ArmazemService;
  let httpTestingController: HttpTestingController;
  let formBuilder: FormBuilder;
  let ARMAZENS: Armazem[];



  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarArmazemComponent],
      imports: [HttpClientTestingModule],
      providers: [ArmazemService, FormBuilder]
    })
      .compileComponents();

    ARMAZENS = [
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
        active: true
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
        active: true
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
        active: true
      }
    ]

    service = TestBed.inject(ArmazemService);
    httpTestingController = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
    component = new EditarArmazemComponent(formBuilder, service);


  });

  it('deve listar os armazens', () => {

    component.listarArmazens();

    const req = httpTestingController.expectOne(config.gestaoArmazens.url + "/api/armazem");
    expect(req.request.method).toEqual('GET');
    req.flush(ARMAZENS);

    expect(component.armazens.data).toEqual(ARMAZENS);


  });

  it('deve listar um armazem e criar um formulario dele e submetê-lo', () => {

    component.getArmazem(ARMAZENS[2].id);

    const req = httpTestingController.expectOne(config.gestaoArmazens.url + "/api/armazem/" + ARMAZENS[2].id);
    expect(req.request.method).toEqual('GET');
    req.flush(ARMAZENS[2]);

    expect(component.armazem.id).toEqual(ARMAZENS[2].id);
    expect(component.armazem.end).toEqual(ARMAZENS[2].end)
    expect(component.armazem.coord).toEqual(ARMAZENS[2].coord)
    expect(component.armazem.designacao).toEqual(ARMAZENS[2].designacao)
    expect(component.armazem.active).toEqual(ARMAZENS[2].active)

    expect(component.armazemForm.valid).toBeTrue(); //Esperas que continue valido
    var arm: Armazem = component.armazem
    arm.designacao = "Banana"
    component.armazemForm.controls['designacao'].setValue("Banana")
    console.log(component.armazemForm.value)
    component.submit();

    const req2 = httpTestingController.expectOne(config.gestaoArmazens.url + "/api/armazem/" + ARMAZENS[2].id);
    expect(req2.request.method).toEqual('PUT');
    req2.flush(arm);

    console.log(arm)
    console.log(Armazem)
    expect(component.armazem).toEqual(arm); //Esperas que retorne o armazem editado
    expect(component.success).toBeTruthy();

  });

  it('deve inibir um armazem e desinibi-lo', () => {
    component.inibirArmazem(ARMAZENS[2].id);

    // O armazem
    const req = httpTestingController.expectOne(config.gestaoArmazens.url + '/api/armazem/' + ARMAZENS[2].id);
    expect(req.request.method).toEqual('GET');
    var arm: Armazem = ARMAZENS[2];
    req.flush(arm); //Como era no GET

    expect(component.armazem.active).toBeFalse();

    // A inibicao

    const req2 = httpTestingController.match(config.gestaoArmazens.url + '/api/armazem/' + component.armazem.id);
    expect(req2[0].request.method).toEqual('PATCH');
    arm.active = !arm.active //Muda atributo
    req2[0].flush(arm);

    expect(component.armazem.active).toBeFalse()

    //Inverso
    component.inibirArmazem(ARMAZENS[2].id);

    // O armazem
    const req3 = httpTestingController.match(config.gestaoArmazens.url + '/api/armazem/' + component.armazem.id);
    expect(req3[0].request.method).toEqual('GET');
    var arm: Armazem = ARMAZENS[2];
    req3[0].flush(arm);//Como era no GET


    expect(component.armazem.active).toBeTrue();

    // A inibicao

    const req4 = httpTestingController.match(config.gestaoArmazens.url + '/api/armazem/' + component.armazem.id);
    expect(req4[0].request.method).toEqual('PATCH');
    arm.active = !arm.active //Muda atributo
    req4[0].flush(arm);

    expect(component.armazem.active).toBeTrue()
  });

});