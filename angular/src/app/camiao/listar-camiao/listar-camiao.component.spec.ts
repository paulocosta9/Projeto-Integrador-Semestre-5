import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { CamiaoService } from 'src/app/services/camiao.service';
import { Camiao } from '../camiao';

import { ListarCamiaoComponent } from './listar-camiao.component';

describe('ListarCamiaoComponent', () => {
  let component: ListarCamiaoComponent;
  let fixture: ComponentFixture<ListarCamiaoComponent>;

  let mockCamiaoService: any;
  let CAMIOES: Camiao[];

  beforeEach(async () => {
    CAMIOES = [
      {
        id: 'adasjhgd821687suiagdsa8',
        nome: 'eTruck01',
        matricula: '01-12-NA',
        tara: 25000,
        capacidadeCarga: 3500,
        cargaTotalBat: 120,
        autonomiaCargaMax: 250,
        tempoCarregamento: 60,
      },
      {
        id: '32131237ysydfhgs',
        nome: 'eTruck02',
        matricula: 'LD-12-88',
        tara: 20000,
        capacidadeCarga: 3531.23,
        cargaTotalBat: 110,
        autonomiaCargaMax: 234,
        tempoCarregamento: 55,
      },
      {
        id: 'sajoidsa7dsa687',
        nome: 'eTruck03',
        matricula: '12-12-FA',
        tara: 30000,
        capacidadeCarga: 3300,
        cargaTotalBat: 100,
        autonomiaCargaMax: 205.23,
        tempoCarregamento: 50,
      },
    ];

    mockCamiaoService = jasmine.createSpyObj(['listarCamioes']);
    await TestBed.configureTestingModule({
      providers: [
        ListarCamiaoComponent,
        {
          provide: CamiaoService,
          useValue: mockCamiaoService,
        },
      ],
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ListarCamiaoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarCamiaoComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('listarArmazens', () => {
    
    mockCamiaoService.listarCamioes.and.returnValue(of(CAMIOES));

    component.listarCamioes();
    var cam: any;
    cam =  component.camioes;
    var table = new MatTableDataSource(CAMIOES);
    expect(cam.data).toEqual(table.data);

  });

});
