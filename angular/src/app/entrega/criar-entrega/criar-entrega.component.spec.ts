import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CriarEntregaComponent } from './criar-entrega.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntregaService } from 'src/app/services/entrega.service';
import { Entrega } from '../entrega';

describe('CriarEntregaComponent', () => {
  let service: EntregaService;
  let component: CriarEntregaComponent;
  let fixture: ComponentFixture<CriarEntregaComponent>;
  let entrega: Entrega;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CriarEntregaComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
    });

    service = TestBed.inject(EntregaService);

    fixture = TestBed.createComponent(CriarEntregaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('formulario invalido quando vazio', () => {
    expect(component.entregaForm.valid).toBeFalsy();
  });

  it('validade do campo ID', () => {
    let id = component.entregaForm.get('id');
    expect(id?.valid).toBeFalsy();

    let errors;

    errors = id?.errors || {};
    expect(errors['required']).toBeTruthy();

    id?.setValue('123165'), (errors = id?.errors || {});
    expect(errors['required']).toBeFalsy();

    id?.setValue('AB0126'), (errors = id?.errors || {});
    expect(errors['minlength']).toBeFalsy();

    id?.setValue('AB126'), (errors = id?.errors || {});
    expect(errors['minlength']).toBeTruthy();

    id?.setValue('AB213676'), (errors = id?.errors || {});
    expect(errors['maxlength']).toBeTruthy();

    id?.setValue('AB0126'), (errors = id?.errors || {});
    expect(errors['maxlength']).toBeFalsy();

    expect(id?.valid).toBeTruthy();
  });

  it('validade do campo Armazem ID', () => {
    let armazem = component.entregaForm.get('armazemEntrega');
    expect(armazem?.valid).toBeFalsy();

    let errors;

    errors = armazem?.errors || {};
    expect(errors['required']).toBeTruthy();

    armazem?.setValue('123'), (errors = armazem?.errors || {});
    expect(errors['required']).toBeFalsy();

    armazem?.setValue('321'), (errors = armazem?.errors || {});
    expect(errors['minlength']).toBeFalsy();

    armazem?.setValue('68'), (errors = armazem?.errors || {});
    expect(errors['minlength']).toBeTruthy();

    armazem?.setValue('875643278432'), (errors = armazem?.errors || {});
    expect(errors['maxlength']).toBeTruthy();

    armazem?.setValue('759'), (errors = armazem?.errors || {});
    expect(errors['maxlength']).toBeFalsy();

    expect(armazem?.valid).toBeTruthy();
  });

  it('validade do campo Data de Entrega', () => {
    let data = component.entregaForm.get('dataEntrega');
    expect(data?.valid).toBeFalsy();

    let errors;

    errors = data?.errors || {};
    expect(errors['required']).toBeTruthy();

    data?.setValue('2024-12-02'), (errors = data?.errors || {});
    expect(errors['required']).toBeFalsy();

    data?.setValue('2028-12-02'), (errors = data?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(data?.valid).toBeTruthy();
  });

  it('validade do campo Massa da Entrega', () => {
    let massa = component.entregaForm.get('massaEntrega');
    expect(massa?.valid).toBeFalsy();

    let errors;

    errors = massa?.errors || {};
    expect(errors['required']).toBeTruthy();

    massa?.setValue('3'), (errors = massa?.errors || {});
    expect(errors['required']).toBeFalsy();

    massa?.setValue('8.4'), (errors = massa?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(massa?.valid).toBeTruthy();
  });

  it('validade do campo Tempo de Carregamento', () => {
    let tempoCarr = component.entregaForm.get('tempoCarregarEntrega');
    expect(tempoCarr?.valid).toBeFalsy();

    let errors;

    errors = tempoCarr?.errors || {};
    expect(errors['required']).toBeTruthy();

    tempoCarr?.setValue('3'), (errors = tempoCarr?.errors || {});
    expect(errors['required']).toBeFalsy();

    tempoCarr?.setValue('8.4'), (errors = tempoCarr?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(tempoCarr?.valid).toBeTruthy();
  });

  it('validade do campo Tempo de Descarregamento', () => {
    let tempoDesc = component.entregaForm.get('tempoDescarregarEntrega');
    expect(tempoDesc?.valid).toBeFalsy();

    let errors;

    errors = tempoDesc?.errors || {};
    expect(errors['required']).toBeTruthy();

    tempoDesc?.setValue('3'), (errors = tempoDesc?.errors || {});
    expect(errors['required']).toBeFalsy();

    tempoDesc?.setValue('8.4'), (errors = tempoDesc?.errors || {});
    expect(errors['required']).toBeFalsy();

    expect(tempoDesc?.valid).toBeTruthy();
  });

  it('verificarDados e validacao do formulario', () => {
    expect(component.entregaForm.valid).toBeFalsy();

    /*id
    armazemEntrega:
    dataEntrega: [this.entrega.dataEntrega],
    massaEntrega: [this.entrega.massaEntrega],
    tempoCarregarEntrega: [this.entrega.tempoCarregarEntrega],
    tempoDescarregarEntrega: [this.entrega.tempoDescarregarEntrega]*/

    let id1 = '1264BA';
    let armazemEntrega1 = '0AB';
    let dataEntrega1 = '2324-10-05';
    let massaEntrega1 = 80.4;
    let tempoCarregarEntrega1 = 15;
    let tempoDescarregarEntrega1 = 20;

    component.entregaForm.get('id')?.setValue(id1);
    component.entregaForm.get('armazemEntrega')?.setValue(armazemEntrega1);
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega1);
    component.entregaForm.get('massaEntrega')?.setValue(massaEntrega1);
    component.entregaForm
      .get('tempoCarregarEntrega')
      ?.setValue(tempoCarregarEntrega1);
    component.entregaForm
      .get('tempoDescarregarEntrega')
      ?.setValue(tempoDescarregarEntrega1);
    expect(component.entregaForm.valid).toBeTruthy();

    let dataEntrega2 = '1120-05-20';
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega2);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[0]).toEqual(
      'Data Entrega ' +
        dataEntrega2 +
        ' não é válida, insira uma data igual ou superior à de hoje.'
    );
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega1);

    let dataEntrega3 = '1121/05/20';
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega3);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[1]).toEqual(
      'Data Entrega ' + dataEntrega3 + ' não é válida.'
    );
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega1);

    let dataEntrega4 = '2250-05-20';
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega4);
    expect(component.verificarDados()).toBeTruthy();
    component.entregaForm.get('dataEntrega')?.setValue(dataEntrega1);

    let massaEntrega2 = 'ABC';
    component.entregaForm.get('massaEntrega')?.setValue(massaEntrega2);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[2]).toEqual(
      'Massa da Entrega ' + massaEntrega2 + ' não é válida'
    );
    component.entregaForm.get('massaEntrega')?.setValue(massaEntrega1);

    let massaEntrega3 = '-123';
    component.entregaForm.get('massaEntrega')?.setValue(massaEntrega3);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[3]).toEqual(
      'Massa da Entrega ' + massaEntrega3 + ' não é válida'
    );
    component.entregaForm.get('massaEntrega')?.setValue(massaEntrega1);

    let tempoCarregarEntrega2 = 'ACD';
    component.entregaForm.get('tempoCarregarEntrega')?.setValue(tempoCarregarEntrega2);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[4]).toEqual(
      'Tempo de carregamento ' + tempoCarregarEntrega2 + ' não é válido'
    );
    component.entregaForm.get('tempoCarregarEntrega')?.setValue(tempoCarregarEntrega1);

    tempoCarregarEntrega2 = '-1356';
    component.entregaForm.get('tempoCarregarEntrega')?.setValue(tempoCarregarEntrega2);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[5]).toEqual(
      'Tempo de carregamento ' + tempoCarregarEntrega2 + ' não é válido'
    );
    component.entregaForm.get('tempoCarregarEntrega')?.setValue(tempoCarregarEntrega1);

    let tempoDescarregarEntrega2 = 'ACD';
    component.entregaForm.get('tempoDescarregarEntrega')?.setValue(tempoDescarregarEntrega2);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[6]).toEqual(
      'Tempo de descarregamento ' + tempoDescarregarEntrega2 + ' não é válido'
    );
    component.entregaForm.get('tempoDescarregarEntrega')?.setValue(tempoDescarregarEntrega1);

    tempoDescarregarEntrega2 = '-1356';
    component.entregaForm.get('tempoDescarregarEntrega')?.setValue(tempoDescarregarEntrega2);
    expect(component.verificarDados()).toBeFalsy();
    expect(component.errorsMessages[7]).toEqual(
      'Tempo de descarregamento ' + tempoDescarregarEntrega2 + ' não é válido'
    );
    component.entregaForm.get('tempoDescarregarEntrega')?.setValue(tempoDescarregarEntrega1);
  });
});
