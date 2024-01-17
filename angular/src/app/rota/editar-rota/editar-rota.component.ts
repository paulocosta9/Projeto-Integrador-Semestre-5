import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { RotaService } from 'src/app/services/rota.service';
import { Rota } from '../rota';

@Component({
  selector: 'app-editar-rota',
  templateUrl: './editar-rota.component.html',
  styleUrls: ['./editar-rota.component.css'],
})
export class EditarRotaComponent implements OnInit {
  rotas: any;
  rota!: Rota;
  rotaForm!: FormGroup;

  errorsMessages: string[] = [];
  edit = false;
  loading = false;
  success = false;
  error = false;

  constructor(private fb: FormBuilder, private rotaService: RotaService) {}

  ngOnInit(): void {
    this.listarRotas();
  }

  back() {
    this.edit = false;
  }

  listarRotas() {
    this.rotas = this.rotaService.getRotas();
  }

  getRota(id: string) {
    this.rotaService.getRota(id).subscribe((data) => {
      this.rota = data;

      this.rotaForm = this.fb.group({
        id: [this.rota.id],
        armazemInicial: [
          this.rota.armazemInicial,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3),
          ],
        ],
        armazemFinal: [
          this.rota.armazemFinal,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3),
          ],
        ],
        duracao: [this.rota.duracao, [Validators.required]],
        energiaGasta: [this.rota.energiaGasta, [Validators.required]],
        distancia: [this.rota.distancia, [Validators.required]],
        tempExtra: [this.rota.tempExtra, [Validators.required]],
      });
      this.edit = true;
    });
  }

  submit() {
    this.loading = true;
    var check = this.verificarDados();
    if (check) {
      this.rotaService.editarRota(this.rotaForm.value).subscribe(
        (data) => {
          this.rota = { ...this.rota, ...this.rotaForm.value };

          this.loading = false;
          this.error = false;
          this.success = true;
        },
        (error) => {
          this.error = true;
          this.success = false;
        }
      );
    }
    this.error = true;
  }

  get id() {
    return this.rotaForm.get('id');
  }

  get armazemInicial() {
    return this.rotaForm.get('armazemInicial');
  }

  get armazemFinal() {
    return this.rotaForm.get('armazemFinal');
  }
  get duracao() {
    return this.rotaForm.get('duracao');
  }

  get energiaGasta() {
    return this.rotaForm.get('energiaGasta');
  }

  get distancia() {
    return this.rotaForm.get('distancia');
  }

  get tempExtra() {
    return this.rotaForm.get('tempExtra');
  }

  verificarDados(): boolean {
    var countErros = 0;
    var armazemInicial = this.rotaForm.get('armazemInicial')!.value;
    var armazemFinal = this.rotaForm.get('armazemFinal')!.value;
    var duracao = this.rotaForm.get('duracao')!.value;
    var energiaGasta = this.rotaForm.get('energiaGasta')!.value;
    var distancia = this.rotaForm.get('distancia')!.value;
    var tempExtra = this.rotaForm.get('tempExtra')!.value;

    if (isNaN(armazemInicial)) {
      this.errorsMessages.push(
        'Armazem Inicial ' +
          armazemInicial +
          ' não é válido tem de ser 3 caracteres numéricos'
      );
      countErros++;
    }

    if (isNaN(armazemFinal)) {
      this.errorsMessages.push(
        'Armazem Inicial ' +
          armazemFinal +
          ' não é válido tem de ser 3 caracteres numéricos'
      );
      countErros++;
    }

    if (!isNaN(duracao)) {
      if (Number(duracao) <= 0) {
        this.errorsMessages.push(
          'Duração ' +
            duracao +
            ' não é válida tem de ser um valor numérico positivo maior que 0'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Duração ' +
          duracao +
          ' não é válida tem de ser um valor numérico positivo maior que 0'
      );
      countErros++;
    }

    if (!isNaN(energiaGasta)) {
      if (Number(energiaGasta) <= 0) {
        this.errorsMessages.push(
          'Energia Gasta ' +
            energiaGasta +
            ' não é válida tem de ser um valor numérico positivo maior que 0'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Energia Gasta ' +
          energiaGasta +
          ' não é válida tem de ser um valor numérico positivo maior que 0'
      );
      countErros++;
    }

    if (!isNaN(distancia)) {
      if (Number(distancia) <= 0) {
        this.errorsMessages.push(
          'Distancia ' +
            distancia +
            ' não é válida tem de ser um valor numérico positivo maior que 0'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Distancia ' +
          distancia +
          ' não é válida tem de ser um valor numérico positivo maior que 0'
      );
      countErros++;
    }

    if (!isNaN(tempExtra)) {
      if (Number(tempExtra) < 0) {
        this.errorsMessages.push(
          'Distancia ' +
            tempExtra +
            ' não é válida tem de ser um valor numérico não negativo'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Distancia ' +
          tempExtra +
          ' não é válida tem de ser um valor numérico não negativo'
      );
      countErros++;
    }

    if (countErros != 0) {
      return false;
    }
    return true;
  }
}
