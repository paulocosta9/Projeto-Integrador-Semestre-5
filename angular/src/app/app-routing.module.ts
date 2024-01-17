import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CriarArmazemComponent } from './armazem/criar-armazem/criar-armazem.component';
import { ListarArmazemComponent } from './armazem/listar-armazem/listar-armazem.component';
import { EditarArmazemComponent } from './armazem/editar-armazem/editar-armazem.component';
import { CriarEmpacotamentoComponent } from './empacotamento/criar-empacotamento/criar-empacotamento.component';
import { ListarEmpacotamentosComponent } from './empacotamento/listar-empacotamento/listar-empacotamento.component';
import { EditarEmpacotamentoComponent } from './empacotamento/editar-empacotamento/editar-empacotamento.component';
import { CriarRotaComponent } from './rota/criar-rota/criar-rota.component';
import { EditarRotaComponent } from './rota/editar-rota/editar-rota.component';
import { ListarRotaComponent } from './rota/listar-rota/listar-rota.component';
import { CriarCamiaoComponent } from './camiao/criar-camiao/criar-camiao.component';
import { EditarCamiaoComponent } from './camiao/editar-camiao/editar-camiao.component';
import { ListarCamiaoComponent } from './camiao/listar-camiao/listar-camiao.component';
import { CriarEntregaComponent } from './entrega/criar-entrega/criar-entrega.component';
import { EditarEntregaComponent } from './entrega/editar-entrega/editar-entrega.component';
import { ListarEntregaComponent } from './entrega/listar-entrega/listar-entrega.component';
import { VisualizerComponent } from './visualizer/visualizer.component';
import { PlaneamentoComponent } from './planeamentoRota/planeamento.component';
import { ListarPercursoComponent } from './percurso/listar-percurso/listar-percurso.component';
import { ListarUserComponent } from './users/listar-users/listar-users.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthguardService } from './services/authguard.service';
import { ProfileComponent } from './profile/profile.component';
import { AlgoritimoGeneticoComponent } from './algoritmoGenetico/algoritmoGenetico.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registar', component: RegisterComponent },
  { path: 'perfil', component: ProfileComponent },

  { path: 'armazem/criar', component: CriarArmazemComponent },
  { path: 'armazem/listar', component: ListarArmazemComponent },
  { path: 'armazem/editar', component: EditarArmazemComponent },
  { path: 'empacotamento/criar', component: CriarEmpacotamentoComponent },
  { path: 'empacotamento/listar', component: ListarEmpacotamentosComponent },
  { path: 'empacotamento/editar', component: EditarEmpacotamentoComponent },
  { path: 'rotas/criar', component: CriarRotaComponent },
  { path: 'rotas/editar', component: EditarRotaComponent },
  { path: 'rotas/listar', component: ListarRotaComponent },
  { path: 'camiao/criar', component: CriarCamiaoComponent },
  { path: 'camiao/editar', component: EditarCamiaoComponent },
  { path: 'camiao/listar', component: ListarCamiaoComponent },
  { path: 'entrega/criar', component: CriarEntregaComponent },
  { path: 'entrega/editar', component: EditarEntregaComponent },
  { path: 'entrega/listar', component: ListarEntregaComponent },
  { path: 'visualizer', component: VisualizerComponent },
  { path: 'planeamento', component: PlaneamentoComponent },
  { path: 'percursos', component: ListarPercursoComponent },
  { path: 'users', component: ListarUserComponent},
  { path: 'planeamento/algoritimoGenetico', component: AlgoritimoGeneticoComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
