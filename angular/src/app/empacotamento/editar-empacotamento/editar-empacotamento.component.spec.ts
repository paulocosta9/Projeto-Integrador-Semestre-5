import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { EmpacotamentoService } from 'src/app/services/empacotamento.service';
import { Empacotamento } from '../empacotamento';

import { EditarEmpacotamentoComponent } from './editar-empacotamento.component';

describe('EditarEmpacotamentoComponent', () => {
  let component: EditarEmpacotamentoComponent;
  let fixture: ComponentFixture<EditarEmpacotamentoComponent>;
  let empacotamento: Empacotamento;
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

    mockEmpacotamentoService = jasmine.createSpyObj(['editarEmpacotamento','getEmpacotamentos','getEmpacotamento']);
      await TestBed.configureTestingModule({providers:[EditarEmpacotamentoComponent,{
        provide: EmpacotamentoService,
        useValue: mockEmpacotamentoService
      }
      ],
        imports:[FormsModule,ReactiveFormsModule],
        declarations: [ EditarEmpacotamentoComponent ]
      })
      .compileComponents();
      
      fixture = TestBed.createComponent(EditarEmpacotamentoComponent);
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

  it('editarEmpacotamento', () => {

    mockEmpacotamentoService.getEmpacotamento.and.returnValue(of(empacotamentos[0]));
    component.getEmpacotamento(empacotamentos[0].id);
    empacotamento = empacotamentos[0];
    empacotamento.entregaId = "12345";
    empacotamento.posicaoX = 77;
    empacotamento.posicaoY = 78;
    empacotamento.posicaoZ = 79;
    component.empacotamentoForm.get("entregaId")?.setValue("12345");
    component.empacotamentoForm.get("posicaoX")?.setValue(77);
    component.empacotamentoForm.get("posicaoY")?.setValue(78);
    component.empacotamentoForm.get("posicaoZ")?.setValue(79);
    mockEmpacotamentoService.editarEmpacotamento.and.returnValue(of(empacotamento));
    expect(component.empacotamentoForm.valid).toBeTruthy();

    component.submit();
    expect(component.empacotamento).toEqual(empacotamento);
    expect(component.success).toBeTruthy();

  });

  
  it('verificarDados e validacao do formulario', () => {
    mockEmpacotamentoService.getEmpacotamento.and.returnValue(of(empacotamentos[0]));
    
    component.getEmpacotamento(empacotamentos[0].id);
    empacotamento = empacotamentos[0];
    empacotamento.posicaoX = 77;
    component.empacotamentoForm.get("posicaoX")?.setValue(77);
    mockEmpacotamentoService.editarEmpacotamento.and.returnValue(of(empacotamento));
    expect(component.empacotamentoForm.valid).toBeTruthy();

    component.submit();
    expect(component.empacotamento).toEqual(empacotamento); //Esperas que retorne o armazem editado
    expect(component.success).toBeTruthy();
    
  })
  
});
