import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ArmazemService } from 'src/app/services/armazem.service';
import { Armazem, Inibir } from '../armazem';

@Component({
  selector: 'app-editar-armazem',
  templateUrl: './editar-armazem.component.html',
  styleUrls: ['./editar-armazem.component.css']
})
export class EditarArmazemComponent implements OnInit {
  armazens: any;
  armazem!: Armazem;
  armazemForm!: FormGroup;


  errorsMessages: string[] = [];
  edit = false;
  loading = false;;
  success = false;
  error = false;

  colunas: string[] = ['armazemId', 'opcoes'];

  constructor(private fb: FormBuilder, private armazemService: ArmazemService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngOnInit(): void {
    this.listarArmazens();
  }

  back() {
    this.edit = false;
    this.listarArmazens();
    this.success = false;
  }

  listarArmazens() {
    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      this.armazens = new MatTableDataSource(data);
      this.armazens.paginator = this.paginator


    });
  }

  getArmazem(arm: string) {
    this.armazemService.listarArmazem(arm).subscribe(data => {

      this.armazem = data;
      //Criar Formulário com o Armazem Recebido
      const end = this.fb.group({
        rua: [this.armazem.end.rua, Validators.required],
        cidade: [this.armazem.end.cidade, Validators.required],
        codigo_postal: [this.armazem.end.codigo_postal, Validators.required],
        pais: [this.armazem.end.pais, Validators.required],
        porta: [this.armazem.end.porta, Validators.required],
      })
      const coord = this.fb.group({
        latitude: [this.armazem.coord.latitude, Validators.required],
        longitude: [this.armazem.coord.longitude, Validators.required],
        altitude: [this.armazem.coord.altitude, Validators.required],
      })

      this.armazemForm = this.fb.group({
        id: [this.armazem.id, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]
        ],
        designacao: [this.armazem.designacao, [Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)]],
        end: end,
        coord: coord,


      });
      this.edit = true;
    });
  }
  //Muda o estado do armazem para o seu contrario (ativo-->inativo||inativo-->ativo)
  inibirArmazem(arm: string) {
    this.armazemService.listarArmazem(arm).subscribe(data => {
      var op = "replace";
      var path = "/Active";
      var inibir;
      this.armazem = data;
      this.armazem.active = !this.armazem.active
      inibir = new Inibir(String(this.armazem.active), path, op);
      var values = []
      values.push(inibir)
      this.armazemService.inibirArmazem(arm, values).subscribe(data => {
        this.armazem = data;
        this.listarArmazens()
      })


    })
  }

  submit() {
    this.loading = true;
    var check = this.verificarDados();

    if (check) {
      this.armazemService.editarArmazem(this.armazemForm.value).subscribe((data) => {

        this.armazem = data;
        this.loading = false;
        this.error = false;
        this.success = true;

      }, (error) => {

        this.error = true;
        this.success = false;
      }

      );
    } this.error = true;
  }

  get id() {
    return this.armazemForm.get('id');
  }

  get designacao() {
    return this.armazemForm.get('designacao');
  }

  get cod_postal() {
    return this.armazemForm.get('end.codigo_postal');
  }
  verificarDados(): boolean {
    var countErros = 0;
    var id = this.armazemForm.get('id')!.value;
    //var des = this.armazemForm.get('designacao')!.value; Bloqueado a 50 caracteres
    //var rua = this.armazemForm.get('end.rua')!.value;
    //var cidade = this.armazemForm.get('end.cidade')!.value;
    var cod_post = this.armazemForm.get('end.codigo_postal')!.value;
    //var pais = this.armazemForm.get('end.pais')!.value;
    var porta = this.armazemForm.get('end.porta')!.value;
    var lat = this.armazemForm.get('coord.latitude')!.value;
    var lon = this.armazemForm.get('coord.longitude')!.value;
    var alt = this.armazemForm.get('coord.altitude')!.value;

    if (isNaN(id)) {
      this.errorsMessages.push("Id " + id + " não é válido tem de ser 3 caracteres numéricos");
      countErros++;
    }

    if (isNaN(porta)) {
      this.errorsMessages.push("Número de Porta " + porta + " não é válido tem de ser um valor numérico");
      countErros++;
    }

    if (!isNaN(lat)) {
      if (Number(lat) >= 90 || Number(lat) <= -90) {
        this.errorsMessages.push("Latitude " + lat + " não é válida tem de ser um valor numérico entre -90 e 90 (exclusive)");
        countErros++;
      }
    } else {
      this.errorsMessages.push("Latitude " + lat + " não é válida tem de ser um valor numérico entre -90 e 90 (exclusive)");
      countErros++;
    }

    if (!isNaN(lon)) {
      if (Number(lon) >= 180 || Number(lat) <= -180) {
        this.errorsMessages.push("Longitude " + lon + " não é válida tem de ser um valor numérico entre -180 e 180 (exclusive)");
        countErros++;
      }
    } else {
      this.errorsMessages.push("Longitude " + lon + " não é válida tem de ser um valor numérico entre -180 e 180 (exclusive)");
      countErros++;
    }

    if (isNaN(alt)) {
      this.errorsMessages.push("Altitude " + alt + " não é válida tem de ser um valor numérico");
      countErros++;
    }
    var regexp = new RegExp('^[0-9]{4}-[0-9]{3}$'),
      test = regexp.test(cod_post);
    if (!test) {
      this.errorsMessages.push("Código Postal " + cod_post + " não é válido. Tem de ser no formato : XXXX-XXX (X é um número inteiro)");
      countErros++;
    }
    if (countErros != 0) {
      return false;
    }
    return true;
  }
}