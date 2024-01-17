import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTreeModule } from '@angular/material/tree';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

import { SidenavComponent } from './sidenav/sidenav.component';


import { CriarArmazemComponent } from './armazem/criar-armazem/criar-armazem.component';
import { ListarArmazemComponent } from './armazem/listar-armazem/listar-armazem.component';
import { EditarArmazemComponent } from './armazem/editar-armazem/editar-armazem.component';

import { CriarEmpacotamentoComponent } from './empacotamento/criar-empacotamento/criar-empacotamento.component';
import { ListarEmpacotamentosComponent } from './empacotamento/listar-empacotamento/listar-empacotamento.component';
import { EditarEmpacotamentoComponent } from './empacotamento/editar-empacotamento/editar-empacotamento.component';

import { CriarCamiaoComponent } from './camiao/criar-camiao/criar-camiao.component';

import { CriarRotaComponent } from './rota/criar-rota/criar-rota.component';
import { EditarRotaComponent } from './rota/editar-rota/editar-rota.component';
import { ListarRotaComponent } from './rota/listar-rota/listar-rota.component';

import { CriarEntregaComponent } from './entrega/criar-entrega/criar-entrega.component';
import { EditarEntregaComponent } from './entrega/editar-entrega/editar-entrega.component';
import { ListarEntregaComponent } from './entrega/listar-entrega/listar-entrega.component';
import { EditarCamiaoComponent } from './camiao/editar-camiao/editar-camiao.component';
import { ListarCamiaoComponent } from './camiao/listar-camiao/listar-camiao.component';
import { VisualizerComponent } from './visualizer/visualizer.component';

import { PlaneamentoComponent } from './planeamentoRota/planeamento.component';


import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from '@abacritt/angularx-social-login';
import config from 'src/config';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

import { ListarPercursoComponent } from './percurso/listar-percurso/listar-percurso.component';
import { RegisterComponent } from './register/register.component';
import { MatSelectModule } from '@angular/material/select';
import { ListarUserComponent } from './users/listar-users/listar-users.component';
import { AlgoritimoGeneticoComponent } from './algoritmoGenetico/algoritmoGenetico.component';



@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatTreeModule,
    MatInputModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    SocialLoginModule,
    MatSelectModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,

    HeaderComponent,
    SidenavComponent,
    CriarArmazemComponent,
    ListarArmazemComponent,
    EditarArmazemComponent,
    CriarEmpacotamentoComponent,
    ListarEmpacotamentosComponent,
    EditarEmpacotamentoComponent,
    CriarCamiaoComponent,
    EditarCamiaoComponent,
    ListarCamiaoComponent,
    CriarRotaComponent,
    EditarRotaComponent,
    ListarRotaComponent,
    CriarEntregaComponent,
    EditarEntregaComponent,
    ListarEntregaComponent,
    VisualizerComponent,
    PlaneamentoComponent,
    ListarPercursoComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    ListarUserComponent,
    AlgoritimoGeneticoComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              config.googleLoginProvider.clientId
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
})
export class AppModule { }