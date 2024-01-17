import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { UtilizadorService } from '../services/utilizador.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  template: ` <button (click)="signOut()">Call function from parent</button> `,
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  socialUser!: SocialUser | undefined;
  login = false;
  constructor(private authService: SocialAuthService, private utilizadorService: UtilizadorService) { }

  ngOnInit(): void {
    console.log(this.login)
    this.authService.authState.subscribe((user) => {
      console.log(this.login)
      this.socialUser = user;
      this.verificarOpcoes();
    });
    this.verificarOpcoes()
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  signOut(): void {
    this.authService.signOut()
    this.login = false;
    if (this.socialUser == null) {
      this.toggleSidebar()
    }

  }

  verificarOpcoes() {
    if (this.socialUser != null) {
      console.log("Here")



      this.utilizadorService.verificarExistencia(this.socialUser.email).subscribe((data) => {
        if (data.email != null) {
          this.login = true;
          this.toggleSidebar()
        }
      }, (error => {
        console.log(error.status)
        this.login = false;
        this.authService.signOut()
      }));


    }
  }
}


