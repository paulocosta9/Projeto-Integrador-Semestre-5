import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CriarRotaComponent } from './criar-rota.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RotaService } from 'src/app/services/rota.service';
import { Rota } from '../rota';

describe('CriarRotaComponent', () => {
  let service: RotaService;
  let component: CriarRotaComponent;
  let fixture: ComponentFixture<CriarRotaComponent>;
  let rota: Rota;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [CriarRotaComponent],
      imports: [
        ReactiveFormsModule, FormsModule,
        HttpClientTestingModule,
      ]
    })

    service = TestBed.inject(RotaService);

    fixture = TestBed.createComponent(CriarRotaComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('formulario invalido quando vazio', () => {
    expect(component.rotaForm.valid).toBeFalsy();
  })

  it('validade do campo armazemInicial', () => {
    let armazemInicial = component.rotaForm.get('armazemInicial');
    expect(armazemInicial?.valid).toBeFalsy();

    let errors;
    errors = armazemInicial?.errors || {};
    expect(errors['required']).toBeTruthy();

    armazemInicial?.setValue('1'),
      errors = armazemInicial?.errors || {};
    expect(errors['minlength']).toBeTruthy();

    armazemInicial?.setValue('111111'), 
      errors = armazemInicial?.errors || {};
    expect(errors['maxlength']).toBeTruthy();

  })

  it('validade do campo armazemFinal', () => {
    let armazemFinal = component.rotaForm.get('armazemFinal');
    expect(armazemFinal?.valid).toBeFalsy();

    let errors;
    errors = armazemFinal?.errors || {};
    expect(errors['required']).toBeTruthy();
    armazemFinal?.setValue('1'),
      errors = armazemFinal?.errors || {};

    expect(errors['required']).toBeFalsy();
    armazemFinal?.setValue('11111'), 
      errors = armazemFinal?.errors || {};
    expect(errors['maxlength']).toBeTruthy();

  })

  

  it('verificarDados duracao', () =>{

    expect(component.rotaForm.valid).toBeFalsy();

    component.rotaForm.get('armazemInicial')?.setValue("123");
    component.rotaForm.get('armazemFinal')?.setValue("124");
    component.rotaForm.get('duracao')?.setValue("10");
    component.rotaForm.get('energiaGasta')?.setValue("10");
    component.rotaForm.get('distancia')?.setValue("10");
    component.rotaForm.get('tempExtra')?.setValue("10");


    expect(component.rotaForm.valid).toBeTruthy();

    component.rotaForm.get('duracao')?.setValue("-10");
    expect(component.verificarDados()).toBeFalse();

  })

  it('verificarDados energiaGasta', () =>{

    expect(component.rotaForm.valid).toBeFalsy();

    component.rotaForm.get('armazemInicial')?.setValue("123");
    component.rotaForm.get('armazemFinal')?.setValue("124");
    component.rotaForm.get('duracao')?.setValue("10");
    component.rotaForm.get('energiaGasta')?.setValue("10");
    component.rotaForm.get('distancia')?.setValue("10");
    component.rotaForm.get('tempExtra')?.setValue("10");


    expect(component.rotaForm.valid).toBeTruthy();

    component.rotaForm.get('energiaGasta')?.setValue("-10");
    expect(component.verificarDados()).toBeFalse();

  })

  it('verificarDados distancia', () =>{

    expect(component.rotaForm.valid).toBeFalsy();

    component.rotaForm.get('armazemInicial')?.setValue("123");
    component.rotaForm.get('armazemFinal')?.setValue("124");
    component.rotaForm.get('duracao')?.setValue("10");
    component.rotaForm.get('energiaGasta')?.setValue("10");
    component.rotaForm.get('distancia')?.setValue("10");
    component.rotaForm.get('tempExtra')?.setValue("10");

    expect(component.rotaForm.valid).toBeTruthy();

    component.rotaForm.get('distancia')?.setValue("-10");
    expect(component.verificarDados()).toBeFalse();

  })

  
  it('verificarDados e submissao', () => {
    expect(component.rotaForm.valid).toBeFalsy();

    component.rotaForm.get('armazemInicial')?.setValue("123");
    component.rotaForm.get('armazemFinal')?.setValue("124");
    component.rotaForm.get('duracao')?.setValue("10");
    component.rotaForm.get('energiaGasta')?.setValue("10");
    component.rotaForm.get('distancia')?.setValue("10");
    component.rotaForm.get('tempExtra')?.setValue("10");

    expect(component.rotaForm.valid).toBeTruthy();

    service.adicionarRota(component.rotaForm.value).subscribe((res) => {
      
      rota = { ...rota, ...component.rotaForm.value }
      expect(res).toEqual(rota);
    });;
    expect(component.error).toBeFalse();
    expect(component.loading).toBeFalse();

  });
});
