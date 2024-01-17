import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EntregaService } from 'src/app/services/entrega.service';
import { Entrega } from '../entrega';

@Component({
  selector: 'app-editar-entrega',
  templateUrl: './editar-entrega.component.html',
  styleUrls: ['./editar-entrega.component.css'],
})
export class EditarEntregaComponent implements OnInit {
  entregas: any;
  entrega!: Entrega;
  entregaForm!: FormGroup;

  errorsMessages: string[] = [];
  edit = false;
  loading = false;
  success = false;
  error = false;

  constructor(
    private fb: FormBuilder,
    private entregaService: EntregaService
  ) {}

  ngOnInit(): void {
    this.listarEntregas();
  }

  back() {
    this.edit = false;
  }

  listarEntregas() {
    this.entregas = this.entregaService.listarEntregas();
  }

  listarEntrega(entrega: string) {
    this.entregaService.listarEntrega(entrega).subscribe((data) => {
      this.entrega = data;

      this.entregaForm = this.fb.group({
        id: [
          this.entrega.id,
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(6),
          ],
        ],

        armazemEntrega: [
          this.entrega.armazemEntrega,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3),
          ],
        ],
        dataEntrega: [this.entrega.dataEntrega],
        massaEntrega: [this.entrega.massaEntrega],
        tempoCarregarEntrega: [this.entrega.tempoCarregarEntrega],
        tempoDescarregarEntrega: [this.entrega.tempoDescarregarEntrega],
      });
      this.edit = true;
    });
  }

  submit() {
    this.loading = true;
    var check = this.verificarDados();
    if (check) {
      this.entregaService.editarEntrega(this.entregaForm.value).subscribe(
        (data) => {
          this.entrega = { ...this.entrega, ...this.entregaForm.value };

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
    return this.entregaForm.get('id');
  }

  get armazemEntrega() {
    return this.entregaForm.get('armazemEntrega');
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

    console.log(id);
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
      console.log(dataEntrega)
      console.log(this.transformDate(dataEntrega))
      console.log(this.isGreaterThanToday(dataEntrega))

      if (!this.isGreaterThanToday(dataEntrega)) {
        this.errorsMessages.push(
          'Data Entrega ' +
            dataEntrega +
            ' não é válida, insira uma data igual ou superior à de hoje.'
        );
        countErros++;
      }
    }

    if (countErros != 0) {
      return false;
    }
    return true;
  }

   transformDate(dateString: string): string {
    // Parse the date string and get the individual parts
    const [year, month, day] = dateString.split("-").map(x => parseInt(x, 10));
  
    // Create a date object
    const date = new Date(year, month - 1, day);
  
    // Format the date as "dd-mm-yyyy"
    const dataTrac = date.toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return dataTrac.replace("/","-").replace("/","-")
  }
  
   isGreaterThanToday(dateString: string): boolean {
    // Parse the date string and get the individual parts
    const [year, month, day] = dateString.split("-").map(x => parseInt(x, 10));
  
    // Create a date object
    const date = new Date(year, month - 1, day);
  
    // Get the current date
    const today = new Date();
  
    // Check if the given date is after today
    return date > today;
  }
}
