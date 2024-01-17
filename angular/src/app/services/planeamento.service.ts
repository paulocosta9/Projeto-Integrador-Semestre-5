import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import config from 'src/config';
import { Entrega } from '../entrega/entrega';
import { Mock } from '../planeamentoRota/mock';
import {
  Heuristica,
  Percurso,
  Planeamento,
} from '../planeamentoRota/planeamento';
import { formatDate } from '@angular/common';
import { RotaService } from './rota.service';
import { CamiaoService } from './camiao.service';
import { AlgGen } from '../algoritmoGenetico/algoritmoGenetico';

@Injectable({
  providedIn: 'root',
})
export class PlaneamentoService {
  private percursoURL = config.logistica.url + '/api/percurso'; // URL to web api
  private entregaURL = config.gestaoArmazens.url + '/api/entrega'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({

      'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')!,
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string,
    private rotaService: RotaService,
    private camiaoService: CamiaoService,
  ) { }

  getPlaneamento(planeamento: Planeamento) {
    planeamento.data = this.reformatDate(planeamento.data);

    try {
      var plan =
        this.http.post<Percurso>(
          this.percursoURL,
          planeamento,
          this.httpOptions
        );
      plan.subscribe((data) => { console.log(data); return data })
    } catch {
      console.log('[!] Connection to the Server Refused [!]');
    }

    return this.mockPlanning(planeamento);
  }

  getHeuristica(planeamento: Heuristica) {
    planeamento.data = this.reformatDate(planeamento.data);
    return this.http.post<Percurso>(
      this.percursoURL + '/heuristica',
      planeamento,
      this.httpOptions
    );
  }

  getEntregas(dataEntrega: string): Observable<Entrega[]> {
    dataEntrega = this.reformatDate(dataEntrega);
    const url = `${this.entregaURL}/data/${dataEntrega}`;
    return this.http.get<Entrega[]>(url, {
      observe: 'body',
      responseType: 'json', headers: this.httpOptions.headers
    });
  }

  reformatDate(dateStr: string) {
    var varDate = new Date(dateStr);
    return formatDate(varDate, 'dd-MM-yyyy', this.locale, 'GMT');
  }

  mockPlanning(planeamento: Planeamento) {
    var massaTotal: number;
    var entregas = this.getEntregas(planeamento.data).pipe(
      map((items) => {
        return items.sort((a, b) => {
          massaTotal += a.massaEntrega!;
          if (a.massaEntrega! < b.massaEntrega!) {
            return 1;
          } else if (a.massaEntrega! > b.massaEntrega!) {
            return -1;
          } else {
            return 0;
          }
        });
      })
    );

    var armazemAtual: string = '005';
    var percurso: string[] = [];
    var tempos: number[] = [];

    entregas = this.getEntregas(planeamento.data).pipe(
      map((items) => {
        return items.filter((value) => {
          percurso.push(value.armazemEntrega);

          var tempoViagem = this.rotaService
            .getRotasByArmazemInicialArmazemFinal(
              armazemAtual,
              value.armazemEntrega
            )
            .pipe(
              map((items) => {
                return items.filter((item) => {
                  var tempoViagemPeso = (item.duracao! * 7500 + massaTotal) / 11800;
                  var tempo = tempoViagemPeso + value.tempoDescarregarEntrega!;
                  tempos.push(tempo);
                  return tempo;
                });
              })
            );

          armazemAtual = value.armazemEntrega;
        });
      })
    );

    var tempoTotal = this.sum(tempos);
    var mock: Mock = new Mock(percurso, tempoTotal);

    const mock$ = new Observable((observer) => {
      observer.next(mock);

      observer.complete();
    });

    return mock$;
  }

  sum(numbers: number[]): number {
    let total = 0;
    for (const num of numbers) {
      total += num;
    }
    return total;
  }

  getAlgGen(planeamento: AlgGen) {
    planeamento.data = this.reformatDate(planeamento.data);
    return this.http.post<String>(
      this.percursoURL + '/algGenetico',
      planeamento,
      this.httpOptions
    );
  }
}
