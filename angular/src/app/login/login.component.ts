import { Component, OnInit } from '@angular/core';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { UtilizadorService } from '../services/utilizador.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  socialUser!: SocialUser | undefined;
  loginDenied = false;
  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private utilizadorService: UtilizadorService
  ) { }
  GoogleLoginProvider = GoogleLoginProvider;
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {

      this.socialUser = user;
      this.verifyExist()
    });
  }

  signInWithGoogle(): void {
    const googleLoginOptions = {
      scope: 'profile email'
    };
    this.authService.signIn(this.GoogleLoginProvider.PROVIDER_ID, googleLoginOptions);

  }

  verifyExist(): void {
    if (this.socialUser != null) {
      this.utilizadorService.verificarExistencia(this.socialUser.email).subscribe((data) => {
        if (data.email != null) {
          this.loginDenied = false;
          this.utilizadorService.accessToken(this.socialUser!.email).subscribe((data) => {
            sessionStorage.setItem('accessToken', data);
            this.router.navigateByUrl("dashboard")
          })

        }
      }, (error => {
        console.log(error.status)
        this.loginDenied = true;
        this.authService.signOut()
      }));

    }
  }
}
