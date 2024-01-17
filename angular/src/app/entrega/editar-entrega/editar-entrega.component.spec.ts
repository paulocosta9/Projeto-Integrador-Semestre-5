import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { EntregaService } from 'src/app/services/entrega.service';
import { Entrega } from '../entrega';

import { EditarEntregaComponent } from './editar-entrega.component';

describe('EditarEntregaComponent', () => {
  let component: EditarEntregaComponent;
  let fixture: ComponentFixture<EditarEntregaComponent>;
  let entrega: Entrega;
  let mockEntregaService: any;
  let Entregas: Entrega[];

  beforeEach(async () => {
    Entregas = [
      {
        dataEntrega: '02-12-2028',
        massaEntrega: 12,
        armazemEntrega: '002',
        tempoCarregarEntrega: 12,
        tempoDescarregarEntrega: 12,

        id: '011124',
      },
      {
        dataEntrega: '02-11-2028',
        massaEntrega: 12,
        armazemEntrega: '102',
        tempoCarregarEntrega: 11,
        tempoDescarregarEntrega: 12,

        id: '211124',
      },
      {
        dataEntrega: '02-10-2028',
        massaEntrega: 12,
        armazemEntrega: '712',
        tempoCarregarEntrega: 12,
        tempoDescarregarEntrega: 12,

        id: '842124',
      },
    ];

    mockEntregaService = jasmine.createSpyObj([
      'editarEntrega',
      'listarEntregas',
      'listarEntrega',
    ]);
    await TestBed.configureTestingModule({
      providers: [
        EditarEntregaComponent,
        {
          provide: EntregaService,
          useValue: mockEntregaService,
        },
      ],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [EditarEntregaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarEntregas', () => {
    mockEntregaService.listarEntregas.and.returnValue(of(Entregas));
    component.listarEntregas();
    var entrs: Entrega[] = [];
    component.entregas.subscribe((data: Entrega[]) => {
      entrs = data;
    });

    expect(entrs).toEqual(Entregas);
  });

  it('editarEntrega', () => {
    mockEntregaService.listarEntrega.and.returnValue(of(Entregas[2]));

    component.listarEntrega(Entregas[2].id);
    entrega = Entregas[2];
    entrega.massaEntrega = 8;
    component.entregaForm.get('massaEntrega')?.setValue(80);
    mockEntregaService.editarEntrega.and.returnValue(of(entrega));
    expect(component.entregaForm.valid).toBeTruthy();

    console.log(component.entrega);
    console.log(entrega);
    component.submit();
    expect(component.entrega).toEqual(entrega);
  });

 

});
