import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CriarEmpacotamentoComponent } from './criar-empacotamento.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmpacotamentoService } from 'src/app/services/empacotamento.service';
import { Empacotamento } from '../empacotamento';

describe('CriarEmpacotamentoComponent', () => {
  let service: EmpacotamentoService;
  let component: CriarEmpacotamentoComponent;
  let fixture: ComponentFixture<CriarEmpacotamentoComponent>;
  let empacotamento: Empacotamento;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CriarEmpacotamentoComponent],
      imports: [
        ReactiveFormsModule, FormsModule,
        HttpClientTestingModule,
      ]
    })

    service = TestBed.inject(EmpacotamentoService);

    fixture = TestBed.createComponent(CriarEmpacotamentoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('formulario invalido quando vazio', () => {
    expect(component.empacotamentoForm.valid).toBeFalsy();
  })

  it('validade do campo entregaId', () => {
    let entregaId = component.empacotamentoForm.get('entregaId');
    expect(entregaId?.valid).toBeFalsy();

    let errors;

    errors = entregaId?.errors || {};
    expect(errors['required']).toBeTruthy();

    entregaId?.setValue('1'),
      errors = entregaId?.errors || {};
    expect(errors['required']).toBeFalsy();
    
    entregaId?.setValue('12345'),
      errors = entregaId?.errors || {};
    expect(errors['minlength']).toBeTruthy();

    entregaId?.setValue('123456'),
      errors = entregaId?.errors || {};
    expect(errors['minlength']).toBeFalsy();

    entregaId?.setValue('1234567'),
      errors = entregaId?.errors || {};
    expect(errors['maxlength']).toBeTruthy();

    entregaId?.setValue('123456'),
      errors = entregaId?.errors || {};
    expect(errors['maxlength']).toBeFalsy();

    expect(entregaId?.valid).toBeTruthy();

  })  

  it('validade do campo posicaoX', () => {
    let posicaoX = component.empacotamentoForm.get('posicaoX');
    expect(posicaoX?.valid).toBeFalsy();

    let errors;

    errors = posicaoX?.errors || {};
    expect(errors['required']).toBeTruthy();
   
    posicaoX?.setValue('7'),
    errors = posicaoX?.errors || {};
    expect(errors['required']).toBeFalsy();

    expect(posicaoX?.valid).toBeTruthy();
    

  })

  it('validade do campo posicaoY', () => {
    let posicaoY = component.empacotamentoForm.get('posicaoY');
    expect(posicaoY?.valid).toBeFalsy();

    let errors;

    errors = posicaoY?.errors || {};
    expect(errors['required']).toBeTruthy();
   
    posicaoY?.setValue('7'),
    errors = posicaoY?.errors || {};
    expect(errors['required']).toBeFalsy();

    expect(posicaoY?.valid).toBeTruthy();
    

  })

  it('validade do campo posiçãoZ', () => {
    let posicaoZ = component.empacotamentoForm.get('posicaoZ');
    expect(posicaoZ?.valid).toBeFalsy();

    let errors;

    errors = posicaoZ?.errors || {};
    expect(errors['required']).toBeTruthy();
   
    posicaoZ?.setValue('7'),
    errors = posicaoZ?.errors || {};
    expect(errors['required']).toBeFalsy();

    expect(posicaoZ?.valid).toBeTruthy();
    

  })

  it('verificarDados e validacao do formulario', () => {
    expect(component.empacotamentoForm.valid).toBeFalsy();

    let entregaId1 = "696969";
    let posicaoX1 = "1";
    let posicaoY1 = "2";
    let posicaoZ1 = "3";

    component.empacotamentoForm.get('entregaId')?.setValue(entregaId1);
    component.empacotamentoForm.get('posicaoX')?.setValue(posicaoX1);
    component.empacotamentoForm.get('posicaoY')?.setValue(posicaoY1);
    component.empacotamentoForm.get('posicaoZ')?.setValue(posicaoZ1);
    expect(component.empacotamentoForm.valid).toBeTruthy();

    let entregaId2 = "";
    component.empacotamentoForm.get('entregaId')?.setValue(entregaId2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[0]).toEqual("EntregaId " + entregaId2 + " não é válida, tem de ser 6 caracteres numéricos");

    entregaId2 = "23"
    component.empacotamentoForm.get('entregaId')?.setValue(entregaId2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[1]).toEqual("EntregaId " + entregaId2 + " não é válida, tem de ser 6 caracteres numéricos");

    entregaId2 = "2323232"
    component.empacotamentoForm.get('entregaId')?.setValue(entregaId2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[2]).toEqual("EntregaId " + entregaId2 + " não é válida, tem de ser 6 caracteres numéricos");
    
    component.empacotamentoForm.get('entregaId')?.setValue(entregaId1);

    let posicaoX2 = "-1";
    component.empacotamentoForm.get('posicaoX')?.setValue(posicaoX2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[3]).toEqual("posicaoX " + posicaoX2 + " não é válida, tem de ser um valor numérico maior que 0");
    
    component.empacotamentoForm.get('posicaoX')?.setValue(posicaoX1);

    let posicaoY2 = "-1";
    component.empacotamentoForm.get('posicaoY')?.setValue(posicaoY2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[4]).toEqual("posicaoY " + posicaoY2 + " não é válida, tem de ser um valor numérico maior que 0");
    
    component.empacotamentoForm.get('posicaoY')?.setValue(posicaoY1);

    let posicaoZ2 = "-1";
    component.empacotamentoForm.get('posicaoZ')?.setValue(posicaoZ2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[5]).toEqual("posicaoZ " + posicaoZ2 + " não é válida, tem de ser um valor numérico maior que 0");
    
    component.empacotamentoForm.get('posicaoZ')?.setValue(posicaoZ1);

    
  })  

});

