import { Component, OnInit, ViewChild } from '@angular/core';
import { RotaService } from '../../services/rota.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rota } from '../rota';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-listar-rota',
  templateUrl: './listar-rota.component.html',
  styleUrls: ['./listar-rota.component.css']
})
export class ListarRotaComponent implements OnInit {

  rotas: any;
  armazemInicial!: null;
  armazemFinal!: null;
  listarForm!: FormGroup;
  errorsMessages: string[] = [];
  error = false;


  //Rotas Por Pagina
  colunas: string[] = ['armazemInicial', 'armazemFinal', "duracao", "energiaGasta", "distancia", "tempoExtra"];

  constructor(private fb: FormBuilder, private rotaService: RotaService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.listarForm = this.fb.group({
      armazemInicial: [this.armazemInicial, [Validators.minLength(3), Validators.maxLength(3)]],
      armazemFinal: [this.armazemFinal, [Validators.minLength(3), Validators.maxLength(3)]],
    });

    this.listarRotas();

  }

  get getArmazemInicial() {
    return this.listarForm.get('armazemInicial');
  }

  get getArmazemFinal() {
    return this.listarForm.get('armazemFinal');
  }

  listarRotas() {
    this.rotaService.getRotas().subscribe((data) => {
      this.rotas = new MatTableDataSource(data);
      this.rotas.paginator = this.paginator

    });
  }
  filtrarRotas() {
    var armazemInicial = this.listarForm.get('armazemInicial')!.value;
    var armazemFinal = this.listarForm.get('armazemFinal')!.value;

    console.log(armazemFinal)
    if (armazemFinal == "") {
      armazemFinal = null;
    }
    if (armazemInicial == "") {
      armazemInicial = null;
    }
    if ((armazemInicial != null && armazemFinal != null)) {
      this.rotaService.getRotasByArmazemInicialArmazemFinal(armazemInicial, armazemFinal).subscribe((data) => {
        this.rotas = new MatTableDataSource(data);
        this.rotas.paginator = this.paginator
      });

    } else if ((armazemInicial != null && armazemFinal == null)) {

      this.rotaService.getRotasByArmazemInicial(armazemInicial).subscribe((data) => {
        this.rotas = new MatTableDataSource(data);
        this.rotas.paginator = this.paginator
      });

    } else if ((armazemInicial == null && armazemFinal != null)) {
      this.rotaService.getRotasByArmazemFinal(armazemFinal).subscribe((data) => {
        this.rotas = new MatTableDataSource(data);
        this.rotas.paginator = this.paginator
      });
    } else if ((armazemInicial == null && armazemFinal == null)) {
      this.listarRotas()
    }
  }


}
