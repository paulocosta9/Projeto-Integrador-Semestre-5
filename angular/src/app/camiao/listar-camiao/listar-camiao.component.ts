import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CamiaoService } from '../../services/camiao.service';
import { Camiao } from '../camiao';

@Component({
    selector: 'app-listar-camiao',
    templateUrl: './listar-camiao.component.html',
    styleUrls: ['./listar-camiao.component.css']
})
export class ListarCamiaoComponent implements OnInit {

    camioes: any;
    selectedOption = "";
    filtros = [
        { nome: "", filtro: "nenhum" },
        { nome: "Inibidos", filtro: "inib" },
        { nome: "Desinibidos", filtro: "desinib" }
    ]

    displayedColumns: string[] = ['nome', 'matricula', 'tara', 'capCarga', 'cargaTotalBat', 'autonomiaCargaMax', 'tempoCarregamento', 'ativo'];

    constructor(private camiaoService: CamiaoService) { }

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ngOnInit(): void {
        this.listarCamioes();
    }

    listarCamioes() {
        this.camiaoService.listarCamioes().subscribe((data: Camiao[]) => {    
            this.camioes = new MatTableDataSource(data);
            this.camioes.paginator = this.paginator;
        });

    }

    filtroPor(value: Event) {
        var filtro = (((value!.target) as HTMLInputElement).value);

        if (filtro == "inib") {
            this.filtroInibido();
        } else if (filtro == "desinib") {
            this.filtroDesinibido()
        } else {
            this.listarCamioes();
        }
    }

    filtroInibido() {
        var cam: Camiao[] = [];
        this.camiaoService.listarCamioes().subscribe((data: Camiao[]) => {
            data.forEach((camiao) => {
                if (camiao.ativo == false) {
                    cam.push(camiao);
                }
            })
            this.camioes = new MatTableDataSource(cam);
            this.camioes.paginator = this.paginator;

        });
    }

    filtroDesinibido() {
        var cam: Camiao[] = [];
        this.camiaoService.listarCamioes().subscribe((data: Camiao[]) => {
            data.forEach((camiao) => {
                if (camiao.ativo == true) {
                    cam.push(camiao);
                }
            })
            this.camioes = new MatTableDataSource(cam);
            this.camioes.paginator = this.paginator;

        });
    }

}
