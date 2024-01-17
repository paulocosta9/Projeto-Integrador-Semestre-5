import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import {
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';
import { Router } from '@angular/router';
import { UtilizadorService } from '../services/utilizador.service';
import { User } from '../profile/utilizador';


/**
 * Object data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface ObjectsNode {
  name: string;
  children?: Routers[];
}
interface Routers {
  name: string;
  url: string;
}


const gestorArmazens: ObjectsNode[] = [
  {
    name: 'Armazem',
    children: [{ name: 'Criar', url: 'armazem/criar' }, { name: 'Editar', url: 'armazem/editar' }, { name: 'Listar', url: 'armazem/listar' }],
  },
  {
    name: 'Entrega',
    children: [{ name: 'Criar', url: 'entrega/criar' }, { name: 'Editar', url: 'entrega/editar' }, { name: 'Listar', url: 'entrega/listar' }],
  },
  
];


const gestorLogistica: ObjectsNode[] = [
  
  {
    name: 'Empacotamento',
    children: [{ name: 'Criar', url: 'empacotamento/criar' }, { name: 'Editar', url: 'empacotamento/editar' }, { name: 'Listar', url: 'empacotamento/listar' }],
  },
  {
    name: 'Rotas',
    children: [{ name: 'Criar', url: 'rotas/criar' }, { name: 'Editar', url: 'rotas/editar' }, { name: 'Listar', url: 'rotas/listar' }],
  },
  
];

const gestorFrota: ObjectsNode[] = [
  {
    name: 'Camiao',
    children: [{ name: 'Criar', url: 'camiao/criar' }, { name: 'Editar', url: 'camiao/editar' }, { name: 'Listar', url: 'camiao/listar' }],
  },
  
];
/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}


/**
 * @title Tree with flat nodes
 */

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})



export class SidenavComponent implements OnInit {



  obj: ObjectsNode | undefined;
  socialUser!: SocialUser | undefined;
  user: User | undefined
  constructor(private authService: SocialAuthService, private userService: UtilizadorService) { this.dataSource.data = gestorArmazens;this.dataSource2.data = gestorLogistica;this.dataSource3.data = gestorFrota }

  @Input() isShown: any[] | undefined;

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.userService.verificarExistencia(this.socialUser.email).subscribe(data => {
        this.user = new User(data.primeiroNome, data.ultimoNome, data.email, data.cargo, data.numeroTelemovel)
        console.log(this.socialUser?.authToken)
      })



    });
  }

  getObject(node: ObjectsNode) {
    if (this.obj?.name != node.name) {
      this.obj = node;
    }

  }



  private _transformer = (node: ObjectsNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,

  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );



  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  dataSource2 = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  dataSource3 = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  



  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

}
