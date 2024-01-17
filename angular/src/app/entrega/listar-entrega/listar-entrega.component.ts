import { Component, OnInit, ViewChild } from '@angular/core';
import { EntregaService } from '../../services/entrega.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { isEmpty, map, Observable } from 'rxjs';
import { Empacotamento } from 'src/app/empacotamento/empacotamento';
import { Entrega } from '../entrega';
@Component({
  selector: 'app-listar-entrega',
  templateUrl: './listar-entrega.component.html',
  styleUrls: ['./listar-entrega.component.css'],
})
export class ListarEntregaComponent implements OnInit {
  selectedOption = 'none';
  entregas: any;
  listaEntregaForm!: FormGroup;
  id!: null;
  armazemEntrega!: null;
  dataEntrega!: null;
  massaEntrega!: null;
  tempoCarregarEntrega!: null;
  tempoDescarregarEntrega!: null;

  constructor(
    private fb: FormBuilder,
    private entregaService: EntregaService
  ) {}

  displayedColumns: string[] = [
    'id',
    'armazemEntrega',
    'dataEntrega',
    'massaEntrega',
    'tempoCarregarEntrega',
    'tempoDescarregarEntrega',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listaEntregaForm = this.fb.group({
      id: [
        this.id,
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],

      armazemEntrega: [
        this.armazemEntrega,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      dataEntrega: [this.dataEntrega],
      massaEntrega: [this.massaEntrega],
      tempoCarregarEntrega: [this.tempoCarregarEntrega],
      tempoDescarregarEntrega: [this.tempoDescarregarEntrega],
      selectedOption: [this.selectedOption],
    });

    this.listarEntregas();
  }

  listarEntregas() {
    this.entregaService.listarEntregas().subscribe((data: Entrega[]) => {
      this.entregas = new MatTableDataSource(data);
      this.entregas.paginator = this.paginator;
    });
  }

  ordenarfiltrarEntregas() {
    var id = this.listaEntregaForm.get('id')!.value;
    var armazem: string = this.listaEntregaForm.get('armazemEntrega')!.value;
    var date = this.listaEntregaForm.get('dataEntrega')!.value;

    switch (true) {
      case id !== null && armazem !== null && date !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return (
                  value.armazemEntrega === armazem &&
                  value.dataEntrega === this.transformToPT(date) &&
                  value.id === id
                );
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      case id !== null && armazem !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return value.armazemEntrega === armazem && value.id === id;
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      case id !== null && date !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return (
                  value.dataEntrega === this.transformToPT(date) &&
                  value.id === id
                );
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      case armazem !== null && date !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return (
                  value.armazemEntrega === armazem &&
                  value.dataEntrega === this.transformToPT(date)
                );
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      case id !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return value.id === id;
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      case armazem !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return value.armazemEntrega === armazem;
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      case date !== null:
        this.ordenarEntregas()
          .pipe(
            map((items) => {
              return items!.filter((value) => {
                return value.dataEntrega === this.transformToPT(date);
              });
            })
          )
          .subscribe((data: Entrega[]) => {
            this.entregas = new MatTableDataSource(data);
            this.entregas.paginator = this.paginator;
          });
        this.listaEntregaForm.reset();
        break;
      default:
        this.ordenarEntregas().subscribe((data) => {
          this.entregas = new MatTableDataSource(data!);
          this.entregas.paginator = this.paginator;
        });
    }
  }

  ordenarEntregas() {
    let ordem = this.selectedOption.substr(this.selectedOption.length - 3);
    let atributo = this.selectedOption.replace(ordem, '');

    switch (this.selectedOption) {
      case '':
      case 'none':
        return this.entregaService.listarEntregas();
      default:
        return this.entregaService.listarEntregas().pipe(
          map((items) => {
            switch (ordem) {
              case 'asc':
                this.selectedOption = 'none';
                if (atributo !== 'dataEntrega') {
                  return items.sort((a, b) => {
                    if (a[atributo] < b[atributo]) {
                      return -1;
                    } else if (a[atributo] > b[atributo]) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
                } else {
                  return items.sort((a, b) => {
                    if (
                      new Date(this.transformToUS(a[atributo])) <
                      new Date(this.transformToUS(b[atributo]))
                    ) {
                      return -1;
                    } else if (
                      new Date(this.transformToUS(a[atributo])) >
                      new Date(this.transformToUS(b[atributo]))
                    ) {
                      return 1;
                    } else {
                      return 0;
                    }
                  });
                }
              case 'des':
                this.selectedOption = 'none';
                if (atributo !== 'dataEntrega') {
                  return items.sort((a, b) => {
                    if (a[atributo] < b[atributo]) {
                      return 1;
                    } else if (a[atributo] > b[atributo]) {
                      return -1;
                    } else {
                      return 0;
                    }
                  });
                } else {
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
                }

              default:
                return null;
            }
          })
        );
    }
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
