import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { CamiaoService } from 'src/app/services/camiao.service';
import { Camiao } from '../camiao';

@Component({
  selector: 'app-editar-camiao',
  templateUrl: './editar-camiao.component.html',
  styleUrls: ['./editar-camiao.component.css']
})
export class EditarCamiaoComponent implements OnInit {
  camioes: any;
  camiao!: Camiao;
  camiaoForm!: FormGroup;


  errorsMessages: string[] = [];
  edit = false;
  loading = false;;
  success = false;
  error = false;

  displayedColumns: string[] = ['matricula', 'opcoes'];

  constructor(private fb: FormBuilder, private camiaoService: CamiaoService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listarCamioes();
  }

  back() {
    this.edit = false;
  }

  listarCamioes() {
    this.camiaoService.listarCamioes().subscribe((data: Camiao[]) => {
      this.camioes = new MatTableDataSource(data);
      this.camioes.paginator = this.paginator;
    });
  }

  listarCamiao(cam: string) {
    this.camiaoService.listarCamiao(cam).subscribe(data => {
      this.camiao = data;

      this.camiaoForm = this.fb.group({
        id: [this.camiao.id, [Validators.required]],
        nome: [this.camiao.nome, [Validators.required]],
        matricula: [this.camiao.matricula, [Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
        Validators.pattern]],
        tara: [this.camiao.tara, [Validators.required]],
        capacidadeCarga: [this.camiao.capacidadeCarga, [Validators.required]],
        cargaTotalBat: [this.camiao.cargaTotalBat, [Validators.required]],
        autonomiaCargaMax: [this.camiao.autonomiaCargaMax, [Validators.required]],
        tempoCarregamento: [this.camiao.tempoCarregamento, [Validators.required]],

      });
      this.edit = true;
    });
  }

  inibirCamiao(cam: string) {
    this.camiaoService.listarCamiao(cam).subscribe(data => {

      this.camiao = data;
      this.camiao.ativo = !this.camiao.ativo;
      this.camiaoService.inibirCamiao(this.camiao.matricula, this.camiao.ativo).subscribe(data => {
        this.camiao = data;
        this.listarCamioes();
      })
    })
  }

  submit() {
    this.loading = true;
    var check = this.verificarDados();

    this.camiaoService.editarCamiao(this.camiaoForm.value).subscribe((data) => {
      this.camiao = { ...this.camiao, ...this.camiaoForm.value }

      this.loading = false;
      this.error = false;
      this.success = true;

    }, (error) => {

      this.error = true;
      this.success = false;

    }

    );

  }

  get matricula() {
    return this.camiaoForm.get('matricula');
  }


  verificarDados(): boolean {
    var countErros = 0;
    var nome = this.camiaoForm.get('nome')!.value;
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
        this.errorsMessages.push("O valor do tempo de carregamento " + tempoCarregamento + " não é válido tem que ser um valor numérico positivo")
        countErros++;
      }
    }

    var regexp = new RegExp('(([0-9]{2}-){2}[A-Z]{2})|([A-Z]{2}(-[0-9]{2}){2})|([A-Z]{2}-[0-9]{2}-[A-Z]{2})|([0-9]{2}-[A-Z]{2}-[0-9]{2})'),
      test = regexp.test(matricula);

    if (!test) {
      this.errorsMessages.push("A matrícula " + matricula + " não é válida. Tem que estar no formato XX-XX-XX");
      countErros++;
    }
    if (countErros != 0) {
      return false;
    }
    return true;
  }


}