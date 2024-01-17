import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, of, pipe } from 'rxjs';
import { EntregaService } from 'src/app/services/entrega.service';
import { Entrega } from '../entrega';
import { ListarEntregaComponent } from './listar-entrega.component';

describe('ListarEntregaComponent', () => {
  let component: ListarEntregaComponent;
  let fixture: ComponentFixture<ListarEntregaComponent>;

  let mockEntregaServiceListar: any;
  let mockEntregaServiceOrd: any;
  let Entregas: Entrega[];
  let EntregasOrd: Entrega[];

  beforeEach(async () => {
    mockEntregaServiceListar = jasmine.createSpyObj([
      'listarEntregas',
      'ordenarEntregas',
    ]);

    Entregas = [
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
      {
        dataEntrega: '17-02-2623',
        massaEntrega: 53,
        armazemEntrega: '712',
        tempoCarregarEntrega: 14,
        tempoDescarregarEntrega: 16,

        id: '142124',
      },
    ];

    EntregasOrd = [
      {
        dataEntrega: '17-12-2623',
        massaEntrega: 12,
        armazemEntrega: '712',
        tempoCarregarEntrega: 12,
        tempoDescarregarEntrega: 12,

        id: '842124',
      },
      {
        dataEntrega: '17-02-2623',
        massaEntrega: 53,
        armazemEntrega: '712',
        tempoCarregarEntrega: 14,
        tempoDescarregarEntrega: 16,

        id: '142124',
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
        dataEntrega: '17-12-2028',
        massaEntrega: 12,
        armazemEntrega: '002',
        tempoCarregarEntrega: 12,
        tempoDescarregarEntrega: 12,

        id: '011124',
      },
    ];

    await TestBed.configureTestingModule({
      providers: [
        ListarEntregaComponent,
        {
          provide: EntregaService,
          useValue: mockEntregaServiceListar,
        },
      ],

      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ListarEntregaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarEntregaComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarEntregas', () => {
    mockEntregaServiceListar.listarEntregas.and.returnValue(of(Entregas));
    component.listarEntregas();
    var entrs = component.entregas.data;
    expect(entrs).toEqual(Entregas);
  });

  it('ordena listagem sobre um atributo', () => {
    const id = null;
    const armazem = null;
    const data = null;
    const option = 'dataEntregades';
    component.selectedOption = option;
    mockEntregaServiceListar.listarEntregas.and.returnValue(of(Entregas));
    component.ordenarfiltrarEntregas();
    var entrs = component.entregas.data;
    expect(entrs).toEqual(EntregasOrd);
  });

  it('filtra listagem sobre VARIOS atributos', () => {
    const id = null;
    const armazem = '712';
    const data = '2623-12-17';
    const option = 'none';
    component.listaEntregaForm.get('armazemEntrega')!.setValue(armazem);
    component.listaEntregaForm.get('dataEntrega')!.setValue(data);
    mockEntregaServiceListar.listarEntregas.and.returnValue(of(Entregas));
    component.ordenarfiltrarEntregas();
    var entrs = component.entregas.data;
    expect(entrs).toEqual([EntregasOrd[0]]);
  });

  it('filtra listagem sobre um atributo', () => {
    const id = null;
    const armazem = '102';
    const data = null;
    const option = 'none';
    component.listaEntregaForm.get('armazemEntrega')!.setValue(armazem);
    mockEntregaServiceListar.listarEntregas.and.returnValue(of(Entregas));
    component.ordenarfiltrarEntregas();
    var entrs = component.entregas.data;
    expect(entrs).toEqual([EntregasOrd[2]]);
  });

  it('ordena e filtra listagem sobre um atributo', () => {
    const id = null;
    const armazem = '712';
    const data = null;
    const option = 'massaEntregades';
    component.listaEntregaForm.get('armazemEntrega')!.setValue(armazem);
    component.selectedOption = option;
    mockEntregaServiceListar.listarEntregas.and.returnValue(of(Entregas));
    component.ordenarfiltrarEntregas();
    var entrs = component.entregas.data;
    expect(entrs).toEqual([EntregasOrd[1],EntregasOrd[0]]);
  });
});
