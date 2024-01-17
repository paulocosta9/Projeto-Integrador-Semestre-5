import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { UtilizadorService } from '../services/utilizador.service';
import { User } from './utilizador';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  socialUser!: SocialUser | undefined;
  user: User | undefined
  constructor(private authService: SocialAuthService, private userService: UtilizadorService) { }

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.userService.verificarExistencia(this.socialUser.email).subscribe(data => {
        this.user = new User(data.primeiroNome, data.ultimoNome, data.email, data.cargo, data.numeroTelemovel)

      })



    });
  }

  refreshAuthToken() {
    this.userService.accessToken(this.socialUser!.email).subscribe((data) => {
      sessionStorage.setItem('accessToken', data);
      console.log(data)
    })
  }

}
