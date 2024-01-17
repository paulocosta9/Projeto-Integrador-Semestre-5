import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Camiao } from '../camiao/camiao';
import config from '../../config'

@Injectable({
  providedIn: 'root'
})
export class CamiaoService {

  private camiaoUrl = config.logistica.url + '/api/camioes';

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')!, 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }


  adicionarCamiao(camiao: Camiao): Observable<Camiao> {

    return this.http.post<Camiao>(this.camiaoUrl, camiao, this.httpOptions);
  }

  listarCamioes(): Observable<Camiao[]> {

    return this.http.get<Camiao[]>(this.camiaoUrl, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });
  }

  listarCamiao(matricula: string): Observable<Camiao> {
    const url = `${this.camiaoUrl}/matricula/${matricula}`;

    return this.http.get<Camiao>(url, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers }).
      pipe(
        map(
          data => {
            return new Camiao(
              data['id'],
              data['nome'],
              data['matricula'],
              data['tara'],
              data['capacidadeCarga'],
              data['cargaTotalBat'],
              data['autonomiaCargaMax'],
              data['tempoCarregamento'],
              data['ativo']
            );
          }
        )
      );
  }

  listarCamiaoNome(nome: string): Observable<Camiao> {
    const url = `${this.camiaoUrl}/nome/${nome}`;

    return this.http.get<Camiao>(url, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers }).
      pipe(
        map(
          data => {
            return new Camiao(
              data['id'],
              data['nome'],
              data['matricula'],
              data['tara'],
              data['capacidadeCarga'],
              data['cargaTotalBat'],
              data['autonomiaCargaMax'],
              data['tempoCarregamento'],
              data['ativo']
            );
          }
        )
      );
  }

  editarCamiao(camiao: Camiao): Observable<Camiao> {
    const url = `${this.camiaoUrl}`;
    return this.http.put<Camiao>(url, camiao, this.httpOptions);
  }

  inibirCamiao(matricula: string, ativo: boolean): Observable<Camiao> {
    const url = `${this.camiaoUrl}/matricula/${matricula}`;
    var body = { "ativo": ativo };
    return this.http.patch<Camiao>(url, body, this.httpOptions);
  }
}