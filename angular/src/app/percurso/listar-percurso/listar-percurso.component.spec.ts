import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PercursoService } from 'src/app/services/percurso.service';
import { Percurso } from '../percurso';
import { Entregas } from '../percurso';
import { ListarPercursoComponent } from './listar-percurso.component';

describe('ListarPercursoComponent', () => {
    let component: ListarPercursoComponent;
    let fixture: ComponentFixture<ListarPercursoComponent>;

    let mockPercursoServiceListar: any;
    let Percurso: Percurso[];
    let Entregas: Entregas[];
    let PercursoOrd: Percurso[];

    beforeEach(async () => {
    
        Percurso = [

            {
                percurso: '3,1,13',
                tempo: 344.86,
                camiao: '12-XC-34',
                entregas: Entregas = [{ armazemEntrega: 6, entrega: 7451 }],
                dataPercurso: '11-01-2023',

            },

            {
                percurso: '6,12,14',
                tempo: 345.86,
                camiao: '12-XC-34',
                entregas: Entregas = [{ armazemEntrega: 6, entrega: 7451 }],
                dataPercurso: '05-12-2022',

            },

            {
                percurso: '9,10,3',
                tempo: 379.36,
                camiao: '23-23-AA',
                entregas: Entregas = [{ armazemEntrega: 9, entrega: 7438 }, { armazemEntrega: 10, entrega: 7464 }, { armazemEntrega: 3, entrega: 7445 },],
                dataPercurso: '05-12-2022',

            },

        ];

        PercursoOrd = [

            {
                percurso: '9,10,3',
                tempo: 379.36,
                camiao: '23-23-AA',
                entregas: Entregas = [{ armazemEntrega: 9, entrega: 7438 }, { armazemEntrega: 10, entrega: 7464 }, { armazemEntrega: 3, entrega: 7445 },],
                dataPercurso: '05-12-2022',

            },

            {
                percurso: '6,12,14',
                tempo: 345.86,
                camiao: '12-XC-34',
                entregas: Entregas = [{ armazemEntrega: 6, entrega: 7451 }],
                dataPercurso: '05-12-2022',

            },

            {
                percurso: '3,1,13',
                tempo: 324.23,
                camiao: '12-XC-34',
                entregas: Entregas = [{ armazemEntrega: 6, entrega: 7451 }],
                dataPercurso: '11-01-2023',

            },

        ];
        mockPercursoServiceListar = jasmine.createSpyObj(['listarPercursos']);
        await TestBed.configureTestingModule({
            providers: [
                ListarPercursoComponent,
                {
                    provide: PercursoService,
                    useValue: mockPercursoServiceListar,
                },
            ],

            imports: [FormsModule, ReactiveFormsModule],
            declarations: [ListarPercursoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ListarPercursoComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('listarPercursos', () => {
        mockPercursoServiceListar.listarPercursos.and.returnValue(of(Percurso));
        component.listarPercursos();
        var per = component.percursos.data;
        expect(per).toEqual(Percurso);
    });

    it('ordena listagem sobre um atributo', () => {

        const option = 'ordDescTempo';

        component.selectedOption = option;
        mockPercursoServiceListar.listarPercursos.and.returnValue(of(Percurso));
        component.ordenarFiltrarPercursos();
        var per = component.percursos.data;
        expect(per).toEqual(PercursoOrd);
    });

    it('filtra listagem sobre VARIOS atributos', () => {

        const tempo = 345.86;
        const camiao = '12-XC-34';

        component.listarPercursoForm.get('tempo')!.setValue(tempo);
        component.listarPercursoForm.get('camiao')!.setValue(camiao);

        mockPercursoServiceListar.listarPercursos.and.returnValue(of(Percurso));
        component.ordenarFiltrarPercursos();
        var per = component.percursos.data;
        expect(per).toEqual([PercursoOrd[1]]);
    });

    it('filtra listagem sobre um atributo', () => {
        const dataPercurso = '05-12-2022';
        component.listarPercursoForm.get('dataPercurso')!.setValue(dataPercurso);

        mockPercursoServiceListar.listarPercursos.and.returnValue(of(Percurso));
        component.ordenarFiltrarPercursos();
        var per = component.percursos.data;
        expect(per).toEqual([Percurso[1],Percurso[2]]);
    });

    it('ordena e filtra listagem sobre um atributo', () => {
        const camiao = '12-XC-34';
        const option = 'ordAscTempo';

        component.listarPercursoForm.get('camiao')!.setValue(camiao);
        component.selectedOption = option;
        mockPercursoServiceListar.listarPercursos.and.returnValue(of(Percurso));
        component.ordenarFiltrarPercursos
        var per = component.percursos.data;
        expect(per).toEqual([PercursoOrd[1],PercursoOrd[2]]);
    });
});
