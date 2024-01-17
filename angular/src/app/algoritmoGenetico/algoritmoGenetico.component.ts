import { Component, OnInit } from '@angular/core';
import { PlaneamentoService } from '../services/planeamento.service';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { AlgGen } from './algoritmoGenetico';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-planeamento-algoritmoGenetico',
  templateUrl: './algoritmoGenetico.component.html',
  styleUrls: ['./algoritmoGenetico.component.css'],
})
export class AlgoritimoGeneticoComponent implements OnInit {

  algGenForm!: FormGroup;
  algGen = new AlgGen(0,0,0,0,0,"");
  errorsMessages: string[] = [];
  /*Form States*/
  loading = false;
  success = false;
  error = false;

  message!: String;


  constructor( private fb: FormBuilder, private planeamentoService: PlaneamentoService) { }

  ngOnInit(): void {

    this.algGenForm = this.fb.group({
      numero_geracoes: [this.algGen.numero_geracoes, [Validators.required]],
      dimensao_populacao: [this.algGen.dimensao_populacao, [Validators.required]],
      prob_cruzamento: [this.algGen.prob_cruzamento, [Validators.required]],
      prob_mutacao: [this.algGen.prob_mutacao, [Validators.required]],
      valor_minimo: [this.algGen.valor_minimo, [Validators.required]],
      data: [this.algGen.data, [Validators.required]],
    });
  }

  get getData() {
    return this.algGenForm.get('data');
  }

  get getNumeroGeracoes() {
    return this.algGenForm.get('numero_geracoes');
  }

  get getProbCruzamento() {
    return this.algGenForm.get('prob_cruzamento');
  }

  get getProbMutacao() {
    return this.algGenForm.get('prob_mutacao');
  }

  get getValorMinimo() {
    return this.algGenForm.get('valor_minimo');
  }

  submit(){
    this.loading = true;
    var check = this.verificarDados();
    console.log(this.algGenForm.value);
    if(check){
      this.planeamentoService.getAlgGen(this.algGenForm.value).subscribe(item => {
        
        console.log(item);
        
        this.message = JSON.stringify(item)

        this.loading = false;
        this.error = false;
        this.success = true;

      });

      
    }  
  }

  verificarDados() {
    return true;
  }

}
