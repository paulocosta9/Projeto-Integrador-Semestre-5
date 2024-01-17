import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { EmpacotamentoService } from 'src/app/services/empacotamento.service';
import { Empacotamento } from '../empacotamento';

import { ListarEmpacotamentosComponent } from './listar-empacotamento.component';


describe('ListarEmpacotamentosComponent', () => {
    let component: ListarEmpacotamentosComponent;
    let fixture: ComponentFixture<ListarEmpacotamentosComponent>;
    
    let mockEmpacotamentoService: any;
    let empacotamentos: Empacotamento[];
    
    beforeEach(async () => {

      empacotamentos = [
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
  
      mockEmpacotamentoService = jasmine.createSpyObj(['getEmpacotamentos']);
      await TestBed.configureTestingModule({providers:[ListarEmpacotamentosComponent,{
        provide: EmpacotamentoService,
        useValue: mockEmpacotamentoService
      }
      ],
        imports:[FormsModule,ReactiveFormsModule],
        declarations: [ ListarEmpacotamentosComponent ]
      })
      .compileComponents();
      
      fixture = TestBed.createComponent(ListarEmpacotamentosComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  
    it('listarEmacotamento', () => {
      
      mockEmpacotamentoService.getEmpacotamentos.and.returnValue(of(empacotamentos));
      component.listarEmpacotamentos();
      var arm: Empacotamento[] = [];
      component.empacotamentos.subscribe((data: Empacotamento[]) => {
        arm = data;
      });
         
      expect(arm).toEqual(empacotamentos);
  
  
    });
});
