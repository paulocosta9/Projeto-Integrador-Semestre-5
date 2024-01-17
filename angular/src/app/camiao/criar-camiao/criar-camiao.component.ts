import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Camiao } from '../camiao';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CamiaoService } from '../../services/camiao.service';
import { identifierName } from '@angular/compiler';
import { count } from 'rxjs';

@Component({
  selector: 'app-criar-camiao',
  templateUrl: './criar-camiao.component.html',
  styleUrls: ['./criar-camiao.component.css']
})
export class CriarCamiaoComponent implements OnInit {

  camiaoForm!: FormGroup;

  camiao = new Camiao("","" ,"", undefined, undefined, undefined, undefined, undefined);
  errorsMessages: string[] = [];
  loading = false;
  success = false;
  error = false;

  constructor(private fb: FormBuilder, private camiaoService: CamiaoService) { }

  ngOnInit(): void {

    this.camiaoForm = this.fb.group({
      nome: [this.camiao.nome, [Validators.required]],
      matricula: [this.camiao.matricula, [Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
      Validators.pattern]],
      tara: [this.camiao.tara, [Validators.required]],
      capacidadeCarga: [this.camiao.capacidadeCarga,  [Validators.required]],
      cargaTotalBat: [this.camiao.cargaTotalBat,  [Validators.required]],
      autonomiaCargaMax: [this.camiao.autonomiaCargaMax,  [Validators.required]],
      tempoCarregamento: [this.camiao.tempoCarregamento,  [Validators.required]],
    });

  }

  get id(){
    return this.camiaoForm.get('id');
  }
  get matricula() {
    return this.camiaoForm.get('matricula');
  }

  get nome() {
    return this.camiaoForm.get('nome');
  }

  submit() {
    this.loading = true;
    var check = this.verificarDados();
    if (check) {
      this.camiaoService.adicionarCamiao(this.camiaoForm.value).subscribe((data) => {
        this.camiao = { ...this.camiao, ...this.camiaoForm.value }

        this.loading = false;
        this.error = false;
        this.success = true;

      }, (error) => {
        if (error.status == 500) {
          this.errorsMessages.push("ERRO: É possível que a matrícula do camião já se encontre registada");
        }
        this.error = true;
        this.success = false;


      });
    }
    this.error = true;
  }
  verificarDados(): boolean {
    var countErros = 0;
    var matricula = this.camiaoForm.get('matricula')!.value;
    var tara = this.camiaoForm.get('tara')!.value;
    var capacidadeCarga = this.camiaoForm.get('capacidadeCarga')!.value;
    var cargaTotalBat = this.camiaoForm.get('cargaTotalBat')!.value;
    var autonomiaCargaMax = this.camiaoForm.get('autonomiaCargaMax')!.value;
    var tempoCarregamento = this.camiaoForm.get('tempoCarregamento')!.value;

    if (isNaN(tara)) {
      this.errorsMessages.push("O valor da tara " + tara + " não é válido tem que ser um valor numérico");
      countErros++;
    }
    else {
      if (Number(tara) < 0) {
        this.errorsMessages.push("O valor da tara " + tara + " não é válido tem que ser um valor numérico positivo");
        countErros++;
      }
    }

    if (isNaN(capacidadeCarga)) {
      this.errorsMessages.push("O valor da capacidade de carga " + capacidadeCarga + " não é válido tem que ser um valor numérico");
      countErros++;
    }
    else {
      if (Number(capacidadeCarga < 0)) {
        this.errorsMessages.push("O valor da capacidade de carga " + capacidadeCarga + " não é válido tem que ser um valor numérico positivo");
        countErros++;

      }
    }

    if (isNaN(cargaTotalBat)) {
      this.errorsMessages.push("O valor da carga total da bateria " + cargaTotalBat + " não é válido tem que ser um valor numérico");
      countErros++;

    }
    else {
      if (Number(cargaTotalBat < 0)) {
        this.errorsMessages.push("O valor da carga total da bateria " + cargaTotalBat + " não é válido tem que ser um valor numérico positivo");
        countErros++;
      }
    }

    if (isNaN(autonomiaCargaMax)) {
      this.errorsMessages.push("O valor da autonomida da carga máxima " + autonomiaCargaMax + " não é válido tem que ser um valor numérico");
      countErros++;
    }
    else {
      if (Number(autonomiaCargaMax < 0)) {
        this.errorsMessages.push("O valor da autonomia da carga máxima " + autonomiaCargaMax + " não é válido tem que ser um valor numérico positivo");
        countErros++;
      }
    }

    if (isNaN(tempoCarregamento)) {
      this.errorsMessages.push("O valor do tempo de carregamento " + tempoCarregamento + " não é válido tem que ser um valor numérico");
      countErros++;
    }
    else {
      if (Number(tempoCarregamento < 0)) {
        this.errorsMessages.push("O valor do tempo de carregamento " + tempoCarregamento + " não é válido tem que ser um valor numérico positivo");
        countErros++;
      }
    }

    var regexp = new RegExp('(([0-9]{2}-){2}[A-Z]{2})|([A-Z]{2}(-[0-9]{2}){2})|([A-Z]{2}-[0-9]{2}-[A-Z]{2})|([0-9]{2}-[A-Z]{2}-[0-9]{2})'),
      test = regexp.test(matricula);
    
    if (!test) {
      this.errorsMessages.push("A matrícula " + matricula + " não é válida. Tem que estar no formato XX-XX-XX e ter 4 números e 2 letras");
      countErros++;
    }
    if (countErros != 0) {
      return false;
    }
    return true;
  }
}
