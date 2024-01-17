import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CriarCamiaoComponent } from './criar-camiao.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CamiaoService } from 'src/app/services/camiao.service';
import { Camiao } from '../camiao';

describe('CriarCamiaoComponent', () => {
  let service: CamiaoService;
  let component: CriarCamiaoComponent;
  let fixture: ComponentFixture<CriarCamiaoComponent>;
  let camiao: Camiao;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CriarCamiaoComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
    });

    service = TestBed.inject(CamiaoService);

    fixture = TestBed.createComponent(CriarCamiaoComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('formulario invalido quando vazio', () => {
    expect(component.camiaoForm.valid).toBeFalsy();
  });

  it('validade do campo nome', () => {
    let nome = component.camiaoForm.get('nome');
    expect(nome?.valid).toBeFalsy();

    let errors;

    errors = nome?.errors || {};
    expect(errors['required']).toBeTruthy();

    nome?.setValue('etruck01'), (errors = nome?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(nome?.valid).toBeTruthy();
  });

  it('validade do campo matricula', () => {
    let matricula = component.camiaoForm.get('matricula');
    expect(matricula?.valid).toBeFalsy();

    let errors;

    errors = matricula?.errors || {};
    expect(errors['required']).toBeTruthy();

    matricula?.setValue('11-AA-11'), (errors = matricula?.errors || {});
    expect(errors['required']).toBeFalsy();

    matricula?.setValue('AA-AA-AA'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeTruthy();

    matricula?.setValue('11-11-11'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeTruthy();

    matricula?.setValue('11-AA-AA'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeTruthy();

    matricula?.setValue('AA-AA-11'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeTruthy();

    matricula?.setValue('AA-11-11'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeFalsy();

    matricula?.setValue('11-AA-11'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeFalsy();

    matricula?.setValue('11-11-AA'), (errors = matricula?.errors || {});
    expect(errors['pattern']).toBeFalsy();

    matricula?.setValue('AA-11'), (errors = matricula?.errors || {});
    expect(errors['minlength']).toBeTruthy();

    matricula?.setValue('11-11-AA'), (errors = matricula?.errors || {});
    expect(errors['minlength']).toBeFalsy();

    matricula?.setValue('11-11-AA-11'), (errors = matricula?.errors || {});
    expect(errors['maxlength']).toBeTruthy();

    matricula?.setValue('11-11-AA'), (errors = matricula?.errors || {});
    expect(errors['maxlength']).toBeFalsy();

    expect(matricula?.valid).toBeTruthy();
  });

  it('validade do campo tara', () => {
    let tara = component.camiaoForm.get('tara');
    expect(tara?.valid).toBeFalsy();

    let errors;

    errors = tara?.errors || {};
    expect(errors['required']).toBeTruthy();

    tara?.setValue('7500.654'), (errors = tara?.errors || {});
    expect(errors['required']).toBeFalsy();

    tara?.setValue('7500'), (errors = tara?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(tara?.valid).toBeTruthy();
  });

  it('validade do campo capacidadeCarga', () => {
    let capacidadeCarga = component.camiaoForm.get('capacidadeCarga');
    expect(capacidadeCarga?.valid).toBeFalsy();

    let errors;

    errors = capacidadeCarga?.errors || {};
    expect(errors['required']).toBeTruthy();

    capacidadeCarga?.setValue('4300.65124'),
      (errors = capacidadeCarga?.errors || {});
    expect(errors['required']).toBeFalsy();

    capacidadeCarga?.setValue('4300'), (errors = capacidadeCarga?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(capacidadeCarga?.valid).toBeTruthy();
  });

  it('validade do campo cargaTotalBat', () => {
    let cargaTotalBat = component.camiaoForm.get('cargaTotalBat');
    expect(cargaTotalBat?.valid).toBeFalsy();

    let errors;

    errors = cargaTotalBat?.errors || {};
    expect(errors['required']).toBeTruthy();

    cargaTotalBat?.setValue('80.14'), (errors = cargaTotalBat?.errors || {});
    expect(errors['required']).toBeFalsy();

    cargaTotalBat?.setValue('80'), (errors = cargaTotalBat?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(cargaTotalBat?.valid).toBeTruthy();
  });

  it('validade do campo autonomiaCargaMax', () => {
    let autonomiaCargaMax = component.camiaoForm.get('autonomiaCargaMax');
    expect(autonomiaCargaMax?.valid).toBeFalsy();

    let errors;

    errors = autonomiaCargaMax?.errors || {};
    expect(errors['required']).toBeTruthy();

    autonomiaCargaMax?.setValue('100.23221'),
      (errors = autonomiaCargaMax?.errors || {});
    expect(errors['required']).toBeFalsy();

    autonomiaCargaMax?.setValue('100'),
      (errors = autonomiaCargaMax?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(autonomiaCargaMax?.valid).toBeTruthy();
  });

  it('validade do campo tempoCarregamento', () => {
    let tempoCarregamento = component.camiaoForm.get('tempoCarregamento');
    expect(tempoCarregamento?.valid).toBeFalsy();

    let errors;

    errors = tempoCarregamento?.errors || {};
    expect(errors['required']).toBeTruthy();

    tempoCarregamento?.setValue('60.9282'),
      (errors = tempoCarregamento?.errors || {});
    expect(errors['required']).toBeFalsy();

    tempoCarregamento?.setValue('60'),
      (errors = tempoCarregamento?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(tempoCarregamento?.valid).toBeTruthy();
  });

  it('verificarDados e validacao do formulario', () => {
    expect(component.camiaoForm.valid).toBeFalsy();
    let id1 = 'fdshigdst7o6sa78das';
    let nome1 = 'etruck01';
    let matricula1 = '11-11-AA';
    let tara1 = 7500;
    let capacidadeCarga1 = 4300;
    let cargaTotalBat1 = 80;
    let autonomiaCargaMax1 = 100;
    let tempoCarregamento1 = 60;
    component.camiaoForm.get('id')?.setValue(id1);
    component.camiaoForm.get('nome')?.setValue(nome1);
    component.camiaoForm.get('matricula')?.setValue(matricula1);
    component.camiaoForm.get('tara')?.setValue(tara1);
    component.camiaoForm.get('capacidadeCarga')?.setValue(capacidadeCarga1);
    component.camiaoForm.get('cargaTotalBat')?.setValue(cargaTotalBat1);
    component.camiaoForm.get('autonomiaCargaMax')?.setValue(autonomiaCargaMax1);
    component.camiaoForm.get('tempoCarregamento')?.setValue(tempoCarregamento1);
    expect(component.camiaoForm.valid).toBeTruthy();

    let matricula2 = 'AA-AA-11';
    component.camiaoForm.get('matricula')?.setValue(matricula2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[0]).toEqual(
      'A matrícula ' +
        matricula2 +
        ' não é válida. Tem que estar no formato XX-XX-XX e ter 4 números e 2 letras'
    );
    component.camiaoForm.get('matricula')?.setValue(matricula1);

    let tara2 = -7500;
    component.camiaoForm.get('tara')?.setValue(tara2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[1]).toEqual(
      'O valor da tara ' +
        tara2 +
        ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('tara')?.setValue(tara1);

    let capacidadeCarga2 = -4300;
    component.camiaoForm.get('capacidadeCarga')?.setValue(capacidadeCarga2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[2]).toEqual(
      'O valor da capacidade de carga ' +
        capacidadeCarga2 +
        ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('capacidadeCarga')?.setValue(capacidadeCarga1);

    let cargaTotalBat2 = -80;
    component.camiaoForm.get('cargaTotalBat')?.setValue(cargaTotalBat2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[3]).toEqual(
      'O valor da carga total da bateria ' +
        cargaTotalBat2 +
        ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('cargaTotalBat')?.setValue(cargaTotalBat1);

    let autonomiaCargaMax2 = -100;
    component.camiaoForm.get('autonomiaCargaMax')?.setValue(autonomiaCargaMax2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[4]).toEqual(
      'O valor da autonomia da carga máxima ' +
        autonomiaCargaMax2 +
        ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('autonomiaCargaMax')?.setValue(autonomiaCargaMax1);

    let tempoCarregamento2 = -60;
    component.camiaoForm.get('tempoCarregamento')?.setValue(tempoCarregamento2);
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[5]).toEqual(
      'O valor do tempo de carregamento ' +
        tempoCarregamento2 +
        ' não é válido tem que ser um valor numérico positivo'
    );
    component.camiaoForm.get('tempoCarregamento')?.setValue(tempoCarregamento1);

    expect(component.camiaoForm.valid).toBeTruthy();
  });
});
