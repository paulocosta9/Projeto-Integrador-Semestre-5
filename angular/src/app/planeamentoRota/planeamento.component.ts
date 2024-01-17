import { Component, OnInit } from '@angular/core';
import { PlaneamentoService } from '../services/planeamento.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Entrega } from '../entrega/entrega';
import { Mock } from '../planeamentoRota/mock';
import { Heuristica, Percurso, Planeamento } from './planeamento';

@Component({
  selector: 'app-planeamento',
  templateUrl: './planeamento.component.html',
  styleUrls: ['./planeamento.component.css'],
})
export class PlaneamentoComponent implements OnInit {
  entregas: Entrega[] = [];
  dataEntrega!: null;
  planeamentoForm!: FormGroup;
  errorsMessages: string[] = [];
  error = false;
  success = false;
  planeamento!: Planeamento;
  heuristica!: Heuristica;
  percurso!: Percurso;
  flag = false;
  message = '';
  camiao = '';
  tempo = '';
  listaEn = '';
  success2 = false;

  constructor(
    private fb: FormBuilder,
    private planeamentoService: PlaneamentoService
  ) { }

  ngOnInit(): void {
    this.planeamentoForm = this.fb.group({
      dataEntrega: [this.dataEntrega, [Validators.required]],
    });
  }

  get getDataEntrega() {
    return this.planeamentoForm.get('dataEntrega');
  }

  submit() {
    var dataEntrega = this.planeamentoForm.get('dataEntrega')!.value;
    let total = 0;

    this.planeamentoService.getEntregas(dataEntrega).subscribe((data) => {
      this.entregas = data;

      total = this.entregas.length;

      if (total == 0) {
        this.error = true;
      } else {
        if (total > 10) {
          this.flag = true;
        } else {
          this.planeamento = new Planeamento('eTruck01', dataEntrega);

          this.planeamentoService
            .getPlaneamento(this.planeamento)
            .subscribe((data) => {
              console.log(data)
              if (data instanceof Percurso) {
                this.percurso = data;

                this.message = this.criarPercursoComTempo(
                  this.planeamento.nome
                );

                this.camiao = this.message.split('Armazém')[0];

                this.tempo = 'Tempo' + this.message.split('Tempo')[1];

                this.listaEn = this.message
                  .replace(this.tempo, '')
                  .replace(this.camiao, '');

                this.success = true;
              } else if (data instanceof Mock) {
                this.listaEn = data.armazem.join();
                this.tempo = data.tempo.toString();
                this.camiao = 'eTruck01';
              }
            });
        }
      }
    });
  }

  submeterHeuristica() {
    var d = (<HTMLInputElement>document!.getElementById('heuristicas')!).value;
    console.log(d);
    var dataEntrega = this.planeamentoForm.get('dataEntrega')!.value;
    this.heuristica = new Heuristica('eTruck01', dataEntrega, d);

    this.planeamentoService.getHeuristica(this.heuristica).subscribe((data) => {
      this.percurso = data;

      this.message = this.criarPercursoComTempo(this.heuristica.nome);
      this.camiao = this.message.split('Armazém')[0];

      this.tempo = 'Tempo' + this.message.split('Tempo')[1];

      this.listaEn = this.message
        .replace(this.tempo, '')
        .replace(this.camiao, '');

      this.flag = false;
      this.success2 = true;
    });
  }

  criarPercursoComTempo(nome: string) {
    var str = nome + '\n';
    for (var i = 0; i < this.percurso.percurso.length; i++) {
      str += 'Armazém Destino ' + this.percurso.percurso[i] + '\n';
      str +=
        '    Entrega ' +
        this.entregaParaArmazem(this.percurso.percurso[i]) +
        '\n';
    }
    str += 'Tempo ' + Math.round(this.percurso.tempo * 100) / 100;
    return str;
  }

  entregaParaArmazem(arm: string) {
    for (var i = 0; i < this.entregas.length; i++) {
      if (this.entregas[i].armazemEntrega == arm) {
        return this.entregas[i].id;
      }
    }
    return 0;
  }
}
