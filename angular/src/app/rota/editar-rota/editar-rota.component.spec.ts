import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { RotaService } from 'src/app/services/rota.service';
import { Rota } from '../rota';

import { EditarRotaComponent } from './editar-rota.component';

describe('EditarRotaComponent', () => {
  let component: EditarRotaComponent;
  let fixture: ComponentFixture<EditarRotaComponent>;
  let rota: Rota;
  let mockRotaService: any;
  let ROTAS: Rota[];

  beforeEach(async () => {

    ROTAS = [
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

    mockRotaService = jasmine.createSpyObj(['editarRota', 'getRotas', 'getRota']);
    await TestBed.configureTestingModule({
      providers: [EditarRotaComponent, {
        provide: RotaService,
        useValue: mockRotaService
      }
      ],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [EditarRotaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditarRotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarRotas', () => {

    mockRotaService.getRotas.and.returnValue(of(ROTAS));
    component.listarRotas();
    var rota: Rota[] = [];
    component.rotas.subscribe((data: Rota[]) => {
      rota = data;
    });

    expect(rota).toEqual(ROTAS);

  });

  it('editarRota', () => {
    mockRotaService.getRota.and.returnValue(of(ROTAS[1])); //Criar o mock do metodo

    component.getRota(ROTAS[1].id); //chama o metodo que usa o mock
    rota = ROTAS[1];
    rota.duracao = 40;
    component.rotaForm.get("duracao")?.setValue(40); //Edita o valor do formulario
    mockRotaService.editarRota.and.returnValue(of(rota)); //Cria o mock do metodo
    expect(component.rotaForm.valid).toBeTruthy(); //Esperas que continue valido

    component.submit();
    expect(component.rota).toEqual(rota); //Esperas que retorne o armazem editado
    expect(component.success).toBeTruthy();



  });

  it('verificarDados e validacao do formulario', () => {
    mockRotaService.getRota.and.returnValue(of(ROTAS[1])); //Criar o mock do metodo

    component.getRota(ROTAS[1].id); //chama o metodo que usa o mock
    rota = ROTAS[1];
    rota.duracao = 40;
    component.rotaForm.get("duracao")?.setValue(40); //Edita o valor do formulario
    mockRotaService.editarRota.and.returnValue(of(rota)); //Cria o mock do metodo
    expect(component.rotaForm.valid).toBeTruthy();


    component.rotaForm.get('duracao')?.setValue(-10);
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    component.rotaForm.get('duracao')?.setValue(rota.duracao);

    component.rotaForm.get('energiaGasta')?.setValue(-10);
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    component.rotaForm.get('energiaGasta')?.setValue(rota.energiaGasta);

    component.rotaForm.get('distancia')?.setValue(-10);
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    component.rotaForm.get('distancia')?.setValue(rota.distancia);

    
    fixture.detectChanges();
    expect(component.rotaForm.valid).toBeTruthy();

    component.submit();
    expect(component.rota).toEqual(rota); //Esperas que retorne o armazem editado
    expect(component.success).toBeTruthy();

  })
});
