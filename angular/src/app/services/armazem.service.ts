import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import config from 'src/config';
import { Armazem, Inibir } from '../armazem/armazem';


@Injectable({
  providedIn: 'root'
})
export class ArmazemService {

  private armazemUrl = config.gestaoArmazens.url + '/api/armazem';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')!, 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  adicionarArmazem(armazem: Armazem): Observable<Armazem> {
    return this.http.post<Armazem>(this.armazemUrl, armazem, this.httpOptions);
  }

  listarArmazens(): Observable<Armazem[]> {
    return this.http.get<Armazem[]>(this.armazemUrl, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });
  }

  listarArmazem(id: string): Observable<Armazem> {
    const url = `${this.armazemUrl}/${id}`;

    return this.http.get<Armazem>(url, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers }).
      pipe(
        map(
          data => {
            return new Armazem(
              data['id'],
              data['end'],
              data['designacao'],
              data['coord'],
              data['active']
            );
          }
        )
      );
  }

  editarArmazem(armazem: Armazem): Observable<Armazem> {
    const url = `${this.armazemUrl}/${armazem.id}`;
    return this.http.put<Armazem>(url, armazem, this.httpOptions);
  }

  inibirArmazem(id: string, values: Inibir[]): Observable<Armazem> {
    const url = `${this.armazemUrl}/${id}`;

    return this.http.patch<Armazem>(url, values, this.httpOptions);
  }




}
