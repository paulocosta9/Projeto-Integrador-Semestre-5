import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ArmazemService } from '../../services/armazem.service';
import { Armazem } from '../armazem';

@Component({
  selector: 'app-listar-armazem',
  templateUrl: './listar-armazem.component.html',
  styleUrls: ['./listar-armazem.component.css']
})
export class ListarArmazemComponent implements OnInit {

  armazens: any;
  selectedOption = "";
  filtros=[
    {nome:"",filtro:"nenhum"},
    {nome:"Inibidos",filtro:"inib"},
    {nome:"Desinibidos",filtro:"desinib"}
  ]

  colunas: string[] = ['armazemId','designacao','rua','cidade','codigo_postal','pais','porta','lat','lon','alt','ativo'];


  constructor(private armazemService: ArmazemService) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.listarArmazens();
  }

  listarArmazens() {


    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      this.armazens = new MatTableDataSource(data);
      this.armazens.paginator = this.paginator
      

    });
  }

  filtroPor(value:Event){
    var filtro = (((value!.target)  as HTMLInputElement).value);
    if(filtro=="inib"){
      this.filtroInibido();
    }else if(filtro=="desinib"){
      this.filtroDesinibido()
    }else{
      this.listarArmazens();
    }
  }

  filtroInibido(){
    var arm:Armazem[]=[];
    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      data.forEach((armazem) =>{
        if(armazem.active==false){
          arm.push(armazem);
        }
      })
      this.armazens = new MatTableDataSource(arm);
      this.armazens.paginator = this.paginator

    });
  }

  filtroDesinibido(){
    var arm:Armazem[]=[];
    this.armazemService.listarArmazens().subscribe((data: Armazem[]) => {
      data.forEach((armazem) =>{
        if(armazem.active==true){
          arm.push(armazem);
        }
      })
      this.armazens = new MatTableDataSource(arm);
      this.armazens.paginator = this.paginator

    });
  }

}
