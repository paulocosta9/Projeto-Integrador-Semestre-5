import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { of } from 'rxjs';
import { ArmazemService } from 'src/app/services/armazem.service';
import { Armazem } from '../armazem';

import { ListarArmazemComponent } from './listar-armazem.component';

describe('ListarArmazemComponent', () => {
  let component: ListarArmazemComponent;
  let fixture: ComponentFixture<ListarArmazemComponent>;
  
  let mockArmazemService: any;
  let ARMAZENS: Armazem[];
  
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

    mockArmazemService = jasmine.createSpyObj(['listarArmazens']);
    await TestBed.configureTestingModule({providers:[ListarArmazemComponent,{
      provide: ArmazemService,
      useValue: mockArmazemService
    }
    ],
      imports:[FormsModule,ReactiveFormsModule],
      declarations: [ ListarArmazemComponent ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarArmazemComponent);
    
    component = fixture.componentInstance;
    
  });

  it('should create', () => {
    
    expect(component).toBeTruthy();
  });

  it('listarArmazens', () => {
    
    mockArmazemService.listarArmazens.and.returnValue(of(ARMAZENS));

    component.listarArmazens();
    var arm: any;
    arm =  component.armazens
    var table = new MatTableDataSource(ARMAZENS);
    expect(arm.data).toEqual(table.data);


  });
});
