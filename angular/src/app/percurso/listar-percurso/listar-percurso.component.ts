import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map } from 'rxjs';
import { MatTableModule } from '@angular/material/table'

import { PercursoService } from '../../services/percurso.service';
import { Percurso } from '../percurso';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-listar-percurso',
  templateUrl: './listar-percurso.component.html',
  styleUrls: ['./listar-percurso.component.css']
})
export class ListarPercursoComponent implements OnInit {

  percursos: any;
  lista: any;
  selectedOption = '';
  percurso!: null;
  tempo!: null;
  camiao!: null;
  entregas!: null;
  dataPercurso!: null;
  listarPercursoForm!: FormGroup;

  colunas: string[] = ['percurso', 'tempo', 'dataPercurso', 'camiao', 'entregas'];

  constructor(private fb: FormBuilder,
    private percursoService: PercursoService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.listarPercursoForm = this.fb.group({
      percurso: [this.percurso],
      tempo: [this.tempo],
      camiao: [this.camiao],
      entregas: [this.entregas],
      dataPercurso: [this.dataPercurso],

    });

    this.listarPercursos();
    this.percursos.paginator = this.paginator;

  }
  ngAfterViewInit() {
    this.percursos.paginator = this.paginator;
  }

  listarPercursos() {

    this.percursoService.listarPercursos().subscribe((data: Percurso[]) => {
      this.percursos = new MatTableDataSource(data);
      this.percursos.paginator = this.paginator;

    });
  }

  ordenarFiltrarPercursos() {

    var tempo = this.listarPercursoForm.get('tempo')!.value;
    var camiao = this.listarPercursoForm.get('camiao')!.value;
    var dataPercurso = this.listarPercursoForm.get('dataPercurso')!.value;

    if (tempo !== null && camiao !== null && dataPercurso !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (
            value.tempo === tempo &&
            value.camiao === camiao &&
            value.dataPercurso === this.transformToPT(dataPercurso)
          );
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();

    }

    else if (tempo !== null && camiao !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (
            value.tempo === tempo &&
            value.camiao === camiao
          );
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();
    }

    else if (tempo !== null && dataPercurso !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (
            value.tempo === tempo &&
            value.dataPercurso === this.transformToPT(dataPercurso)
          );
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();
    }

    else if (camiao !== null && dataPercurso !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (
            value.camiao === camiao &&
            value.dataPercurso === this.transformToPT(dataPercurso)
          );
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();
    }

    else if (tempo !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (value.tempo === tempo)
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();
    }

    else if (camiao !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (
            value.camiao === camiao
          );
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();
    }

    else if (dataPercurso !== null) {
      this.ordenaPor().pipe(map((items) => {
        return items!.filter((value) => {
          return (
            value.dataPercurso === this.transformToPT(dataPercurso)
          );
        });
      })
      ).subscribe((data: Percurso[]) => {
        this.percursos = new MatTableDataSource(data);
        this.percursos.paginator = this.paginator;
      });
      this.listarPercursoForm.reset();
    }

    else {
      this.ordenaPor().subscribe((data) => {
        this.percursos = new MatTableDataSource(data!);
        this.percursos.paginator = this.paginator;
      });

    }
  }

  ordenaPor() {

    let ordena = this.selectedOption;
    let atributo: string;

    switch (ordena) {

      case ('ordAscTempo'):
        atributo = 'tempo';
        return this.ordenaAsc(atributo);

      case ('ordDescTempo'):
        atributo = 'tempo';
        return this.ordenaDesc(atributo);

      case ('ordAscData'):
        atributo = 'dataPercurso';
        return this.ordenaAscData(atributo);

      case ('ordDescData'):
        atributo = 'dataPercurso';
        return this.ordenaDescData(atributo);

      case ('ordAscCamiao'):
        atributo = 'camiao';
        return this.ordenaAsc(atributo);

      case ('ordDescCamiao'):
        atributo = 'camiao';
        return this.ordenaAsc(atributo);

      default:
        return this.percursoService.listarPercursos();

    }

  }

  ordenaAsc(atributo: string) {

    return this.percursoService.listarPercursos().pipe(
      map((items) => {
        return items.sort((a, b) => {
          if (a[atributo] < b[atributo]) {
            return -1;
          }
          else if (a[atributo] > b[atributo]) {
            return 1;
          }
          else {
            return 0;
          }
        });
      }));

  }

  ordenaDesc(atributo: string) {
    return this.percursoService.listarPercursos().pipe(
      map((items) => {
        return items.sort((a, b) => {
          if (a[atributo] < b[atributo]) {
            return 1;
          }
          else if (a[atributo] > b[atributo]) {
            return -1;
          }
          else {
            return 0;
          }
        });
      }));
  }

  ordenaAscData(atributo: string) {
    return this.percursoService.listarPercursos().pipe(
      map((items) => {
        return items.sort((a, b) => {
          if (
            new Date(this.transformToUS(a[atributo])) <
            new Date(this.transformToUS(b[atributo]))
          ) {
            return -1;
          }
          else if (
            new Date(this.transformToUS(a[atributo])) >
            new Date(this.transformToUS(b[atributo]))
          ) {
            return 1;
          }
          else {
            return 0;
          }
        });
      }));
  }

  ordenaDescData(atributo: string) {
    return this.percursoService.listarPercursos().pipe(
      map((items) => {
        return items.sort((a, b) => {
          if (
            new Date(this.transformToUS(a[atributo])) <
            new Date(this.transformToUS(b[atributo]))
          ) {
            return 1;
          } else if (
            new Date(this.transformToUS(a[atributo])) >
            new Date(this.transformToUS(b[atributo]))
          ) {
            return -1;
          } else {
            return 0;
          }
        });
      }));
  }

  transformToUS(dateString: string): string {
    // Parse the date string and get the individual parts
    const [day, month, year] = dateString
      .split('-')
      .map((x) => parseInt(x, 10));

    // Create a date object
    const date = new Date(year, month - 1, day);

    // Format the date as "dd-mm-yyyy"
    const dataTrac = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dataTrac.replace('/', '-').replace('/', '-');
  }

  transformToPT(dateString: string): string {
    // Parse the date string and get the individual parts
    const [year, month, day] = dateString
      .split('-')
      .map((x) => parseInt(x, 10));

    // Create a date object
    const date = new Date(year, month - 1, day);

    // Format the date as "dd-mm-yyyy"
    const dataTrac = date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dataTrac.replace('/', '-').replace('/', '-');
  }

}
