import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Empacotamento } from '../empacotamento';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { EmpacotamentoService } from '../../services/empacotamento.service';

@Component({
  selector: 'app-criar-empacotamento',
  templateUrl: './criar-empacotamento.component.html',
  styleUrls: ['./criar-empacotamento.component.css']
})
export class CriarEmpacotamentoComponent implements OnInit{
  
  empacotamentoForm!:FormGroup;
  
  empacotamento = new Empacotamento("", "", undefined, undefined, undefined);
  errorsMessages: string[] = [];
  /*Form States*/
  loading = false;
  success = false;
  error = false;

  constructor(private fb: FormBuilder,private empacotamentoService: EmpacotamentoService) { }
 
  
  ngOnInit(): void {
  

    this.empacotamentoForm = this.fb.group({
      entregaId: [this.empacotamento.entregaId,[Validators.required,Validators.minLength(6), Validators.maxLength(6)]],
      posicaoX:[this.empacotamento.posicaoX,[Validators.required]],
      posicaoY:[this.empacotamento.posicaoY,[Validators.required]],
      posicaoZ:[this.empacotamento.posicaoZ,[Validators.required]],
    });

  }
   
  get entregaId(){
    return this.empacotamentoForm.get('entregaId');
  }

  get posicaoX(){
    return this.empacotamentoForm.get('posicaoX');
  }

  get posicaoY(){
    return this.empacotamentoForm.get('posicaoY');
  }

  get posicaoZ(){
    return this.empacotamentoForm.get('posicaoZ');
  }
  
  submit(){
    this.loading = true;
    var check = this.verificarDados();
    if(check){
    this.empacotamentoService.adicionarEmpacotamento(this.empacotamentoForm.value).subscribe((data)=>{
      this.empacotamentoService = {...this.empacotamento,...this.empacotamentoForm.value}
    
    this.loading = false;
    this.error = false;
    this.success = true;
   
    },(error)=>{
      if(error.status==402){
        this.errorsMessages.push("ERRO: É possível que essa entrega não exista!");
      }
        this.error=true;
        this.success=false;
        
        
        
      });}
      this.error=true;
  }

  verificarDados(): boolean{
    var countErros = 0;
    var entregaId =  this.empacotamentoForm.get('entregaId')!.value;
    var posicaoX = this.empacotamentoForm.get('posicaoX')!.value;
    var posicaoY = this.empacotamentoForm.get('posicaoY')!.value;
    var posicaoZ = this.empacotamentoForm.get('posicaoZ')!.value;
    
    if(isNaN(entregaId)){
      this.errorsMessages.push("EntregaId " + entregaId + " não é válida, tem de ser 6 caracteres numéricos");
      countErros++;
    } else {
      if(entregaId.length < 6 || entregaId.length > 6) {
        this.errorsMessages.push("EntregaId " + entregaId + " não é válida, tem de ser 6 caracteres numéricos");
        countErros++;
      }
    }
  
    if(!isNaN(posicaoX)){
      if(Number(posicaoX)<0){
        this.errorsMessages.push("posicaoX " + posicaoX + " não é válida, tem de ser um valor numérico maior que 0");
        countErros++;
      }
    }
  
    if(!isNaN(posicaoY)){ 
      if(Number(posicaoY)<0){
        this.errorsMessages.push("posicaoY " + posicaoY + " não é válida, tem de ser um valor numérico maior que 0");
        countErros++;
      }
    }

    if(!isNaN(posicaoZ)){ 
      if(Number(posicaoZ)<0){
        this.errorsMessages.push("posicaoZ " + posicaoZ + " não é válida, tem de ser um valor numérico maior que 0");
        countErros++;
      }
    }

    if(countErros!=0){
      return false;
    }
      return true;
    }


}
