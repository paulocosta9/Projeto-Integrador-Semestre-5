import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import config from 'src/config';
import { Percurso } from '../percurso/percurso';


@Injectable({
  providedIn: 'root'
})
export class PercursoService {

  private percursoUrl = config.logistica.url + '/api/percurso';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'Bearer ' + sessionStorage.getItem('accessToken')!, 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }



  listarPercursos(): Observable<Percurso[]> {
    return this.http.get<Percurso[]>(this.percursoUrl, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });
  }

  listarPercursosPorData(data: string): Observable<Percurso[]> {

    const url = `${this.percursoUrl}/data/${data}`;
    return this.http.get<Percurso[]>(url, { observe: 'body', responseType: 'json', headers: this.httpOptions.headers });
  }

}
