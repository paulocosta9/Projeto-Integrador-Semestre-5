import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CriarArmazemComponent } from './criar-armazem.component';
import { ArmazemService } from 'src/app/services/armazem.service';
import { Armazem } from '../armazem';
import { of } from 'rxjs';


describe('CriarArmazemComponent', () => {
  let component: CriarArmazemComponent;
  let fixture: ComponentFixture<CriarArmazemComponent>;
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
        active: true
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
        active: true
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
        active: true
      }
    ]

    mockArmazemService = jasmine.createSpyObj(['adicionarArmazem']);

    TestBed.configureTestingModule({
      declarations: [CriarArmazemComponent],
      imports: [
        ReactiveFormsModule, FormsModule,

      ], providers: [
        CriarArmazemComponent,
        {
          provide: ArmazemService,
          useValue: mockArmazemService,
        }
      ]
    })



    fixture = TestBed.createComponent(CriarArmazemComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });



  it('deve criar', () => {
    expect(component).toBeTruthy();
  });

  it('formulario invalido quando vazio', () => {
    expect(component.armazemForm.valid).toBeFalsy();
  })
  describe("validacao de campos", () => {
    it('validade do campo id', () => {
      let id = component.armazemForm.get('id');
      expect(id?.valid).toBeFalsy();

      let errors;
      errors = id?.errors || {};
      expect(errors['required']).toBeTruthy();

      id?.setValue('1'),
        errors = id?.errors || {};
      fixture.detectChanges();
      expect(errors['minlength']).toBeTruthy();

      id?.setValue('11'),
        errors = id?.errors || {};
      fixture.detectChanges();
      expect(errors['minlength']).toBeTruthy();

      id?.setValue('1111'),
        errors = id?.errors || {};
      fixture.detectChanges();
      expect(errors['maxlength']).toBeTruthy();

    })

    it('validade do campo designacao', () => {
      let des = component.armazemForm.get('designacao');
      expect(des?.valid).toBeFalsy();

      let errors;
      errors = des?.errors || {};
      expect(errors['required']).toBeTruthy();

      des?.setValue('1'),
        errors = des?.errors || {};
      fixture.detectChanges();
      expect(errors['minlength']).toBeFalsy();

      des?.setValue('111111111111111111111111111111111111111111111111111111111111'), //60
        errors = des?.errors || {};
      fixture.detectChanges();
      expect(errors['maxlength']).toBeTruthy();

    })

    it('validade do campo rua', () => {
      let rua = component.armazemForm.get('end.rua');
      expect(rua?.valid).toBeFalsy();

      let errors;
      errors = rua?.errors || {};
      expect(errors['required']).toBeTruthy();

      rua?.setValue('1'),
        errors = rua?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();

      rua?.setValue('111111111111111111111111111111111111111111111111111111111111'), //60
        errors = rua?.errors || {};
      fixture.detectChanges();
      expect(errors['maxlength']).toBeTruthy();

    })

    it('validade do campo cidade', () => {
      let cid = component.armazemForm.get('end.cidade');
      expect(cid?.valid).toBeFalsy();

      let errors;
      errors = cid?.errors || {};
      expect(errors['required']).toBeTruthy();

      cid?.setValue('1'),
        errors = cid?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();

      cid?.setValue('111111111111111111111111111111111111111111111111111111111111'), //60
        errors = cid?.errors || {};
      fixture.detectChanges();
      expect(errors['maxlength']).toBeTruthy();

    })

    it('validade do campo pais', () => {
      let pais = component.armazemForm.get('end.pais');
      expect(pais?.valid).toBeFalsy();

      let errors;
      errors = pais?.errors || {};
      expect(errors['required']).toBeTruthy();

      pais?.setValue('1'),
        errors = pais?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();

      pais?.setValue('111111111111111111111111111111111111111111111111111111111111'), //60
        errors = pais?.errors || {};
      fixture.detectChanges();
      expect(errors['maxlength']).toBeTruthy();

    })

    it('validade do campo porta', () => {
      let porta = component.armazemForm.get('end.porta');
      expect(porta?.valid).toBeFalsy();

      let errors;
      errors = porta?.errors || {};
      expect(errors['required']).toBeTruthy();

      porta?.setValue('1'),
        errors = porta?.errors || {};
      expect(errors['required']).toBeFalsy();

      porta?.setValue('1111111'),
        errors = porta?.errors || {};
      fixture.detectChanges();
      expect(errors['maxlength']).toBeTruthy();

    })

    it('validade do campo codigo postal', () => {
      let cod = component.armazemForm.get('end.codigo_postal');
      expect(cod?.valid).toBeFalsy();

      let errors;
      errors = cod?.errors || {};
      expect(errors['required']).toBeTruthy();

      cod?.setValue('1'),
        errors = cod?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();
      expect(errors['pattern']).toBeTruthy();

      cod?.setValue('1111111'),
        errors = cod?.errors || {};
      fixture.detectChanges();
      expect(errors['pattern']).toBeTruthy();

      cod?.setValue('2222-222'),
        errors = cod?.errors || {};
      fixture.detectChanges();
      expect(errors['pattern']).toBeFalsy();

    })

    it('validade do campo latitude', () => {
      let lat = component.armazemForm.get('coord.latitude');
      expect(lat?.valid).toBeFalsy();

      let errors;
      errors = lat?.errors || {};
      expect(errors['required']).toBeTruthy();

      lat?.setValue('1'),
        errors = lat?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();

      lat?.setValue('11.111'),
        errors = lat?.errors || {};



    })

    it('validade do campo longitude', () => {
      let lon = component.armazemForm.get('coord.longitude');
      expect(lon?.valid).toBeFalsy();

      let errors;
      errors = lon?.errors || {};
      expect(errors['required']).toBeTruthy();

      lon?.setValue('1'),
        errors = lon?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();

      lon?.setValue('11.111'),
        errors = lon?.errors || {};
      fixture.detectChanges();


    })

    it('validade do campo altitude', () => {
      let alt = component.armazemForm.get('coord.altitude');
      expect(alt?.valid).toBeFalsy();

      let errors;
      errors = alt?.errors || {};
      expect(errors['required']).toBeTruthy();

      alt?.setValue('1'),
        errors = alt?.errors || {};
      fixture.detectChanges();
      expect(errors['required']).toBeFalsy();

      alt?.setValue('11'),
        errors = alt?.errors || {};
      fixture.detectChanges();
    })
  });

  it('verificarDados e validacao do formulario', () => {
    expect(component.armazemForm.valid).toBeFalsy();

    component.armazemForm.get('id')?.setValue("444");
    component.armazemForm.get('designacao')?.setValue("Maia Norte");
    component.armazemForm.get('end.rua')?.setValue("Rua");
    component.armazemForm.get('end.cidade')?.setValue("Vigo");
    component.armazemForm.get('end.pais')?.setValue("Espanha");
    component.armazemForm.get('end.porta')?.setValue("6676");
    component.armazemForm.get('end.codigo_postal')?.setValue("3333-333");
    component.armazemForm.get('coord.latitude')?.setValue("11.1");
    component.armazemForm.get('coord.longitude')?.setValue("11.1");
    component.armazemForm.get('coord.altitude')?.setValue("100");

    expect(component.armazemForm.valid).toBeTruthy();


    component.armazemForm.get('id')?.setValue("444");
    component.armazemForm.get('end.codigo_postal')?.setValue("SSSS-333");
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[0]).toEqual("Código Postal SSSS-333 não é válido. Tem de ser no formato : XXXX-XXX (X é um número inteiro)")

    component.armazemForm.get('end.codigo_postal')?.setValue("3333-333");
    component.armazemForm.get('end.porta')?.setValue("s");
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[1]).toEqual("Número de Porta s não é válido tem de ser um valor numérico")

    component.armazemForm.get('end.porta')?.setValue("6676");
    component.armazemForm.get('coord.latitude')?.setValue("s");
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[2]).toEqual("Latitude s não é válida tem de ser um valor numérico entre -90 e 90 (exclusive)")

    component.armazemForm.get('coord.latitude')?.setValue("11.1");
    component.armazemForm.get('coord.longitude')?.setValue("s");
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[3]).toEqual("Longitude s não é válida tem de ser um valor numérico entre -180 e 180 (exclusive)")

    component.armazemForm.get('coord.longitude')?.setValue("11.1");
    component.armazemForm.get('coord.altitude')?.setValue("s");
    fixture.detectChanges();
    expect(component.verificarDados()).toBeFalse();
    expect(component.errorsMessages[4]).toEqual("Altitude s não é válida tem de ser um valor numérico")

    component.armazemForm.get('coord.altitude')?.setValue("100");
    fixture.detectChanges();
    expect(component.armazemForm.valid).toBeTruthy();
  })
  it('verificarDados e submissao é bem sucedida', () => {
    expect(component.armazemForm.valid).toBeFalsy();

    mockArmazemService.adicionarArmazem.and.returnValue(of(ARMAZENS[2]));
    var id = "121"
    var designacao = "Mai"

    var rua = "Viela"
    var cidade = "Porto"
    var codigo_postal = "3333-333"
    var pais = "Portugal"
    var porta = 22


    var latitude = 33.3
    var longitude = 22.2
    var altitude = 100


    component.armazemForm.get('id')?.setValue(id);
    component.armazemForm.get('designacao')?.setValue(designacao);
    component.armazemForm.get('end.rua')?.setValue(rua);
    component.armazemForm.get('end.cidade')?.setValue(cidade);
    component.armazemForm.get('end.pais')?.setValue(pais);
    component.armazemForm.get('end.porta')?.setValue(porta);
    component.armazemForm.get('end.codigo_postal')?.setValue(codigo_postal);
    component.armazemForm.get('coord.latitude')?.setValue(latitude);
    component.armazemForm.get('coord.longitude')?.setValue(longitude);
    component.armazemForm.get('coord.altitude')?.setValue(altitude);
    expect(component.armazemForm.valid).toBeTruthy();
    component.submit();

    expect(component.armazem.id).toEqual(id);
    expect(component.armazem.designacao).toEqual(designacao);
    expect(component.armazem.end.rua).toEqual(rua);
    expect(component.armazem.coord.latitude).toEqual(latitude);
    expect(component.success).toBeTruthy();


  });
});
