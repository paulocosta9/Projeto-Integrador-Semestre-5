import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Entrega } from '../entrega';
import { formatDate } from '@angular/common';
import { Inject, LOCALE_ID } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { EntregaService } from '../../services/entrega.service';

@Component({
  selector: 'app-criar-entrega',
  templateUrl: './criar-entrega.component.html',
  styleUrls: ['./criar-entrega.component.css'],
})
export class CriarEntregaComponent implements OnInit {
  entregaForm!: FormGroup;

  entrega = new Entrega('', '', '', undefined, undefined, undefined);

  errorsMessages: string[] = [];

  loading = false;
  success = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private entregaService: EntregaService,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  ngOnInit(): void {
    this.entregaForm = this.fb.group({
      id: [
        this.entrega.id,
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],

      armazemEntrega: [
        this.entrega.armazemEntrega,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      dataEntrega: [this.entrega.dataEntrega],
      massaEntrega: [this.entrega.massaEntrega],
      tempoCarregarEntrega: [this.entrega.tempoCarregarEntrega],
      tempoDescarregarEntrega: [this.entrega.tempoDescarregarEntrega],
    });
  }

  get id() {
    return this.entregaForm.get('id');
  }

  get armazemEntrega() {
    return this.entregaForm.get('armazemEntrega');
  }

  get dataEntrega() {
    return this.entregaForm.get('dataEntrega');
  }

  get massaEntrega() {
    return this.entregaForm.get('massaEntrega');
  }

  get tempoCarregarEntrega() {
    return this.entregaForm.get('tempoCarregarEntrega');
  }

  get tempoDescarregarEntrega() {
    return this.entregaForm.get('tempoDescarregarEntrega');
  }

  submit() {
    this.loading = true;
    var check = this.verificarDados();
    if (check) {
      this.entregaService.adicionarEntrega(this.entregaForm.value).subscribe(
        (data) => {
          this.entrega = { ...this.entrega, ...this.entregaForm.value };

          this.loading = false;
          this.success = true;
          this.error = false;
        },
        (error) => {
          if (error.status != 201) {
            this.error = true;
            this.success = false;
            throw 'Nao foi criado';
          }
        }
      );
    }
    this.error = true;
  }

  verificarDados(): boolean {
    var countErros = 0;
    var id = this.entregaForm.get('id')!.value;
    var armazemEntrega = this.entregaForm.get('armazemEntrega')!.value;
    var massaEntrega = this.entregaForm.get('massaEntrega')!.value;
    var tempoCarregarEntrega = this.entregaForm.get(
      'tempoCarregarEntrega'
    )!.value;
    var tempoDescarregarEntrega = this.entregaForm.get(
      'tempoDescarregarEntrega'
    )!.value;
    var dataEntrega = this.entregaForm.get('dataEntrega')!.value;

    if (id.length != 6) {
      this.errorsMessages.push(
        'Id ' + id + ' não é válido, insira um ID com 6 caracteres'
      );
      countErros++;
    }

    if (armazemEntrega.length != 3) {
      this.errorsMessages.push(
        'Id de Armazém ' +
          armazemEntrega +
          ' não é válido, insira um ID de Armazém com 3 caracteres'
      );
      countErros++;
    }

    if (!isNaN(massaEntrega)) {
      if (Number(massaEntrega) < 0) {
        this.errorsMessages.push(
          'Massa da Entrega ' + massaEntrega + ' não é válida'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Massa da Entrega ' + massaEntrega + ' não é válida'
      );
      countErros++;
    }

    if (!isNaN(tempoCarregarEntrega)) {
      if (Number(tempoCarregarEntrega) < 0) {
        this.errorsMessages.push(
          'Tempo de carregamento ' + tempoCarregarEntrega + ' não é válido'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Tempo de carregamento ' + tempoCarregarEntrega + ' não é válido'
      );
      countErros++;
    }
    if (!isNaN(tempoDescarregarEntrega)) {
      if (Number(tempoDescarregarEntrega) < 0) {
        this.errorsMessages.push(
          'Tempo de descarregamento ' +
            tempoDescarregarEntrega +
            ' não é válido'
        );
        countErros++;
      }
    } else {
      this.errorsMessages.push(
        'Tempo de descarregamento ' + tempoDescarregarEntrega + ' não é válido'
      );
      countErros++;
    }

    var regexp = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
      regexData = regexp.test(dataEntrega);
    if (!regexData) {
      this.errorsMessages.push(
        'Data Entrega ' + dataEntrega + ' não é válida.'
      );
      countErros++;
    } else {
      var varDate = new Date(dataEntrega);
      var todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      var varDate2 = formatDate(varDate, 'dd-MM-yyyy', this.locale, 'GMT');
      var todayDate2 = formatDate(todayDate, 'dd-MM-yyyy', this.locale, 'GMT');
      console.log(varDate2);
      console.log(todayDate2);
      if (varDate < todayDate) {
        console.log("PILA");
        countErros++;
        this.errorsMessages.push(
          'Data Entrega ' +
            dataEntrega +
            ' não é válida, insira uma data igual ou superior à de hoje.'
        );
      }
    }

    if (countErros != 0) {
      return false;
    }
    return true;
  }
}
