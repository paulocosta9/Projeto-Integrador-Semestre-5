import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Empacotamento } from '../empacotamento/empacotamento';
import config from '../../config'


@Injectable({
  providedIn: 'root'
})
export class EmpacotamentoService {

  private empacotamentoUrl = config.logistica.url + '/api/empacotamentos';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')!, 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  adicionarEmpacotamento(empacotamento: Empacotamento): Observable<Empacotamento> {
    return this.http.post<Empacotamento>(this.empacotamentoUrl, empacotamento, this.httpOptions);
  }

  getEmpacotamentos(): Observable<Empacotamento[]> {
    console.log(this.empacotamentoUrl)
    return this.http.get<Empacotamento[]>(this.empacotamentoUrl, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });
  }

  getEmpacotamento(id: string): Observable<Empacotamento> {
    const url = `${this.empacotamentoUrl}/${id}`;

    return this.http.get<Empacotamento>(url, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers }).
      pipe(
        map(
          data => {
            return new Empacotamento(
              data['id'],
              data['entregaId'],
              data['posicaoX'],
              data['posicaoY'],
              data['posicaoZ']
            );
          }
        )
      );
  }

  editarEmpacotamento(empacotamento: Empacotamento): Observable<Empacotamento> {
    const url = `${this.empacotamentoUrl}/`;
    console.log(empacotamento);
    return this.http.put<Empacotamento>(url, empacotamento, this.httpOptions);
  }


}
