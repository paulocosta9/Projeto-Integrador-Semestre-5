import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { UtilizadorService } from '../services/utilizador.service';
import { User } from '../profile/utilizador';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  user = new User("", "", "", "", undefined)
  cargos = [
    "Gestor Logística",
    "Gestor Armazém",
    "Gestor de Frota",
  ]
  /*Form States*/
  loading = false;
  success = false;
  error = false;

  messages: string[] = [];

  constructor(private fb: FormBuilder, private loginService: UtilizadorService) { }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      primeiroNome: [this.user.primeiroNome, [Validators.required]],
      ultimoNome: [this.user.ultimoNome, [Validators.required]],
      email: [this.user.email, [Validators.email, Validators.required]],
      numeroTelemovel: [this.user.numeroTelemovel, [Validators.min(100000000), Validators.max(999999999), Validators.required]],
      cargo: [this.user.cargo, [Validators.required]]

    });
  }

  get primeiroNome() {
    return this.registerForm.get('primeiroNome')
  }

  get ultimoNome() {
    return this.registerForm.get('ultimoNome')
  }

  get email() {
    return this.registerForm.get('email')
  }

  get numeroTelemovel() {
    return this.registerForm.get('numeroTelemovel')
  }

  get cargo() {
    return this.registerForm.get('cargo')
  }


  submit() {
    this.loading = true;
    this.loginService.adicionarUtilizador(this.registerForm.value).subscribe((data) => {
      this.user = this.registerForm.value;
      this.success = true;
      this.loading = false;
    }, (erro) => {

      this.tipoDeErro(erro.error.errors.message)
      this.error = true;
      this.loading = false;
    });

  }

  tipoDeErro(erros: string) {

    if (erros.includes("E11000 duplicate key error")) {
      this.messages.push("E-mail ou Número de Telemóvel inválidos. Pertencentes a outro utilizador")
    }

  }
}
