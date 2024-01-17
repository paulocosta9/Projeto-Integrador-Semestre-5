import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EmpacotamentoService } from '../../services/empacotamento.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';


export interface Entrega{
  entregaId:number;
  posicaoX:number;
  posicaoY:number;
  posicaoZ:number;
}

const ELEMENT_DATA:Entrega[]=[
  { entregaId: 1, posicaoX: 1, posicaoY: 2, posicaoZ: 3 },
  { entregaId: 1, posicaoX: 1, posicaoY: 2, posicaoZ: 3 },
  { entregaId: 2, posicaoX: 1, posicaoY: 2, posicaoZ: 3 },
  { entregaId: 2, posicaoX: 1, posicaoY: 2, posicaoZ: 3 },
];

@Component({
  selector: 'app-listar-empacotamentos',
  templateUrl: './listar-empacotamento.component.html',
  styleUrls: ['./llstar-empacotamento.component.css']
})
export class ListarEmpacotamentosComponent implements AfterViewInit {
  

  empacotamentos: any;
  lista: any;
  displayedColumns: string[]=['entregaId','X','Y','Z'];

  constructor(private empacotamentoService: EmpacotamentoService) { }

  
  ngOnInit(): void {
    
    this.listarEmpacotamentos();
    this.empacotamentos.paginator = this.paginator;
  }

  @ViewChild(MatPaginator) paginator!:MatPaginator;

  ngAfterViewInit(){
    this.empacotamentos.paginator = this.paginator;
  }

  listarEmpacotamentos(){
    this.lista = this.empacotamentoService.getEmpacotamentos();
    this.empacotamentoService.getEmpacotamentos().subscribe((data)=>{
      console.log("ola1");
      console.log(data);
      this.empacotamentos = new MatTableDataSource(data);
      console.log("ola2");
      console.log(this.empacotamentos);
      this.empacotamentos.paginator = this.paginator;
      });
    
    // this.empacotamentos = new MatTableDataSource(ELEMENT_DATA);

    
  }





}