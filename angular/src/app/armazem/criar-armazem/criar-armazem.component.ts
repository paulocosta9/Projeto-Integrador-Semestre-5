import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Armazem, Coordenadas, Endereco } from '../armazem';
import { AbstractControl, FormBuilder,FormGroup,Validators } from '@angular/forms';
import { ArmazemService } from '../../services/armazem.service';

@Component({
  selector: 'app-criar-armazem',
  templateUrl: './criar-armazem.component.html',
  styleUrls: ['./criar-armazem.component.css']
})
export class CriarArmazemComponent implements OnInit{
  
  armazemForm!:FormGroup;
  
  armazem = new Armazem("",new Endereco("","","","",undefined),"", new Coordenadas(undefined,undefined ,undefined),true);
  errorsMessages: string[] = [];
  /*Form States*/
  loading = false;
  success = false;
  error = false;

  constructor(private fb: FormBuilder,private armazemService: ArmazemService) { }
 
  
  ngOnInit(): void {
    
    const end = this.fb.group({
      rua:[this.armazem.end.rua,[Validators.required,Validators.maxLength(50)]],
      cidade:[this.armazem.end.cidade,[Validators.required,Validators.maxLength(50)]],
      codigo_postal:[this.armazem.end.codigo_postal,[Validators.required,Validators.maxLength(8),Validators.pattern("^[0-9]{4}-[0-9]{3}$")]],
      pais:[this.armazem.end.pais,[Validators.required,Validators.maxLength(50)]],
      porta:[this.armazem.end.porta,[Validators.required,Validators.maxLength(5)]],
    })
    const coord = this.fb.group({
      latitude:[this.armazem.coord.latitude,[Validators.required,Validators.maxLength(8)]],
      longitude:[this.armazem.coord.longitude,[Validators.required,Validators.maxLength(8)]],
      altitude:[this.armazem.coord.altitude,[Validators.required,Validators.maxLength(8)]],
    })

    this.armazemForm = this.fb.group({
      id:[this.armazem.id,[Validators.required,
      Validators.minLength(3),
      Validators.maxLength(3)]],
      designacao: [this.armazem.designacao,[Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)]],
      end: end,
      coord: coord,
      
    });

  }

  get id(){
    return this.armazemForm.get('id');
  }
  
  get designacao(){
    return this.armazemForm.get('designacao');
  }
  get cod_postal(){
    return  this.armazemForm.get('end.codigo_postal');
  }

  get rua(){
    return this.armazemForm.get('end.rua');
  }

  get cidade(){
    return this.armazemForm.get('end.cidade')
  }

  get pais(){
    return this.armazemForm.get('end.pais')
  }

  get porta(){
    return this.armazemForm.get('end.porta')
  }

  get lat(){
    return this.armazemForm.get('coord.latitude')
  }

  get lon(){
    return this.armazemForm.get('coord.longitude')
  }

  get alt(){
    return this.armazemForm.get('coord.altitude')
  }




  submit(){
    this.loading = true;
    
    var check = this.verificarDados();
    if(check){
    this.armazemService.adicionarArmazem(this.armazemForm.value).subscribe((data)=>{
      this.armazem = {...this.armazem,...this.armazemForm.value}
      
    this.loading = false;
    this.error = false;
    this.success = true;
    
    },(error)=>{
      if(error.status==500){
        this.errorsMessages.push("ERRO: Possível que o Id do Armazém já se encontre registado");
        
      }
        this.error=true;
        this.success=false;
        
        
      });}
      this.error=true;
  }
  verificarDados(): boolean{
    var countErros = 0;
    //var id =  this.armazemForm.get('id')!.value;
    //var des = this.armazemForm.get('designacao')!.value; Bloqueado a 50 caracteres
    //var rua = this.armazemForm.get('end.rua')!.value;
    //var cidade = this.armazemForm.get('end.cidade')!.value;
    var cod_post = this.armazemForm.get('end.codigo_postal')!.value;
    //var pais = this.armazemForm.get('end.pais')!.value;
    var porta = this.armazemForm.get('end.porta')!.value;
    var lat = this.armazemForm.get('coord.latitude')!.value;
    var lon = this.armazemForm.get('coord.longitude')!.value;
    var alt = this.armazemForm.get('coord.altitude')!.value;
    
    /*if(isNaN(id)){
      this.errorsMessages.push("Id " + id + " não é válido tem de ser 3 caracteres numéricos");
      countErros++;
    }*/
  
    if(isNaN(porta)){
      this.errorsMessages.push("Número de Porta " + porta + " não é válido tem de ser um valor numérico");
      countErros++;
    }
  
    if(!isNaN(lat)){
      if(Number(lat)>=90 || Number(lat)<=-90){
      this.errorsMessages.push("Latitude " + lat + " não é válida tem de ser um valor numérico entre -90 e 90 (exclusive)");
      countErros++;}
    }else{
      this.errorsMessages.push("Latitude " + lat + " não é válida tem de ser um valor numérico entre -90 e 90 (exclusive)");
      countErros++;
    }
  
    if(!isNaN(lon)){
      if(Number(lon)>=180 || Number(lat)<=-180){
      this.errorsMessages.push("Longitude " + lon + " não é válida tem de ser um valor numérico entre -180 e 180 (exclusive)");
      countErros++;}
    }else{
      this.errorsMessages.push("Longitude " + lon + " não é válida tem de ser um valor numérico entre -180 e 180 (exclusive)");
      countErros++;
    }
  
    if(isNaN(alt)){
      this.errorsMessages.push("Altitude " + alt + " não é válida tem de ser um valor numérico");
      countErros++;
    }
    var regexp = new RegExp('^[0-9]{4}-[0-9]{3}$'),
    test = regexp.test(cod_post);
    if(!test){
      this.errorsMessages.push("Código Postal " + cod_post + " não é válido. Tem de ser no formato : XXXX-XXX (X é um número inteiro)");
      countErros++;
    }
    if(countErros!=0){
      return false;
    }
      return true;
    }
  




}
