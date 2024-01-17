import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { EmpacotamentoService } from '../../services/empacotamento.service';
import { Empacotamento } from '../empacotamento';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-editar-empacotamento',
  templateUrl: './editar-empacotamento.component.html',
  styleUrls: ['./editar-empacotamento.component.css']
})
export class EditarEmpacotamentoComponent implements OnInit {
  empacotamentos: any;
  lista: any;
  empacotamento!: Empacotamento;
  empacotamentoForm!: FormGroup;
  displayedColumns: string[]=['entregaId','editar'];


  errorsMessages: string[] = [];
  edit = false;
  loading = false;;
  success = false;
  error = false;

  constructor(private fb: FormBuilder, private empacotamentoService: EmpacotamentoService) { }

  @ViewChild(MatPaginator) paginator!:MatPaginator;

  ngOnInit(): void {
    this.listarEmpacotamentos();
  }

  back(){
    this.edit=false;
  }

  listarEmpacotamentos() {
    this.lista = this.empacotamentoService.getEmpacotamentos();
    this.empacotamentoService.getEmpacotamentos().subscribe((data)=>{
      console.log("ola1");
      console.log(data);
      this.empacotamentos = new MatTableDataSource(data);
      console.log("ola2");
      console.log(this.empacotamentos);
      this.empacotamentos.paginator = this.paginator;
      });
  }

  getEmpacotamento(emp: string) {
    this.empacotamentoService.getEmpacotamento(emp).subscribe(data => {
      this.empacotamento = data;

      this.empacotamentoForm = this.fb.group({
        id: [this.empacotamento.id,Validators.required],
        entregaId: [this.empacotamento.entregaId,Validators.required],
        posicaoX:[this.empacotamento.posicaoX,Validators.required],
        posicaoY:[this.empacotamento.posicaoY,Validators.required],
        posicaoZ:[this.empacotamento.posicaoZ,Validators.required],

      });
      this.edit = true;
    });
  }

  get entregaId(){
    return this.empacotamentoForm.get('entregaId');
  }
  
  submit() {
    this.loading = true;
    var check = this.verificarDados();
    if(check){
    this.empacotamentoService.editarEmpacotamento(this.empacotamentoForm.value).subscribe((data) => {
      this.empacotamento = { ...this.empacotamento, ...this.empacotamentoForm.value }

      this.loading = false;
      this.error = false;
      this.success = true;
      
    }, (error) => {
      
        this.error = true;
        this.success = false;
       

      }
    
    );}this.error=true;
  }

  verificarDados(): boolean{
    var countErros = 0;
    var entregaId =  this.empacotamentoForm.get('entregaId')!.value;
    var posicaoX = this.empacotamentoForm.get('posicaoX')!.value;
    var posicaoY = this.empacotamentoForm.get('posicaoY')!.value;
    var posicaoZ = this.empacotamentoForm.get('posicaoZ')!.value;
    
    if(isNaN(entregaId)){
      this.errorsMessages.push("EntregaId " + entregaId + " não é válido tem de ser 6 caracteres numéricos");
      countErros++;
    }
  
    if(!isNaN(posicaoX)){
      if(Number(posicaoX)<0){
      this.errorsMessages.push("posicaoX " + posicaoX + " não é válida tem de ser um valor numérico maior que 0");
      countErros++;}
    }
  
    if(!isNaN(posicaoY)){
      if(Number(posicaoY)<0){
      this.errorsMessages.push("posicaoY " + posicaoY + " não é válida tem de ser um valor numérico maior que 0");
      countErros++;}
    }

    if(!isNaN(posicaoZ)){
      if(Number(posicaoZ)<0){
      this.errorsMessages.push("posicaoZ " + posicaoZ + " não é válida tem de ser um valor numérico maior que 0");
      countErros++;}
    }

    if(countErros!=0){
      return false;
    }
      return true;
    }
}