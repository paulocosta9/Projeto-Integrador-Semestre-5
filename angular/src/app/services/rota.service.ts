import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Rota } from '../rota/rota';
import config from '../../config'

@Injectable({
  providedIn: 'root'
})
export class RotaService {

  private rotaUrl = config.logistica.url + '/api/rotas';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')!, 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  adicionarRota(rota: Rota): Observable<Rota> {
    console.log(rota);
    return this.http.post<Rota>(this.rotaUrl, rota, this.httpOptions);
  }

  getRotas(): Observable<Rota[]> {
    return this.http.get<Rota[]>(this.rotaUrl, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });
  }

  getRotasByArmazemInicial(armazemInicial: string): Observable<Rota[]> {
    const url = `${this.rotaUrl}/armIn/${armazemInicial}`;

    return this.http.get<Rota[]>(url, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });

  }

  getRotasByArmazemFinal(armazemFinal: string): Observable<Rota[]> {
    const url = `${this.rotaUrl}/armFin/${armazemFinal}`;

    return this.http.get<Rota[]>(url, { observe: 'body', responseType: 'json' });

  }


  getRotasByArmazemInicialArmazemFinal(armazemInicial: string, armazemFinal: string): Observable<Rota[]> {
    const url = `${this.rotaUrl}/armIn/${armazemInicial}/armFin/${armazemFinal}`;

    return this.http.get<Rota[]>(url, { observe: 'body', responseType: 'json' });

  }


  getRota(id: string): Observable<Rota> {
    const url = `${this.rotaUrl}/${id}`;

    return this.http.get<Rota>(url, { observe: 'body', responseType: 'json' }).
      pipe(
        map(
          data => {
            return new Rota(
              data['id'],
              data['armazemInicial'],
              data['armazemFinal'],
              data['duracao'],
              data['energiaGasta'],
              data['distancia'],
              data['tempExtra']
            );
          }
        )
      );
  }

  editarRota(rota: Rota): Observable<Rota> {
    const url = `${this.rotaUrl}/`;
    return this.http.put<Rota>(url, rota, this.httpOptions);
  }


}
