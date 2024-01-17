import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { Entrega } from '../entrega/entrega';
import { Inject, LOCALE_ID } from '@angular/core';
import { formatDate } from '@angular/common';
import config from 'src/config';


@Injectable({
  providedIn: 'root',
})
export class EntregaService {
  private entregaURL = config.gestaoArmazens.url + '/api/entrega'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) {}

  adicionarEntrega(entrega: Entrega): Observable<Entrega> {
    entrega.dataEntrega = this.transformDate(entrega.dataEntrega);
    return this.http.post<Entrega>(this.entregaURL, entrega, this.httpOptions);
  }

  listarEntregas(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(this.entregaURL, {
      observe: 'body',
      responseType: 'json',
    });
  }

  listarEntrega(id: string): Observable<Entrega> {
    const url = `${this.entregaURL}/${id}`;

    return this.http
      .get<Entrega>(url, { observe: 'body', responseType: 'json' })
      .pipe(
        map((data) => {
          return new Entrega(
            data['id'],
            data['armazemEntrega'],
            data['dataEntrega'],
            data['massaEntrega'],
            data['tempoCarregarEntrega'],
            data['tempoDescarregarEntrega']
          );
        })
      );
  }

  editarEntrega(entrega: Entrega): Observable<Entrega> {
    const url = `${this.entregaURL}/${entrega.id}`;
    entrega.dataEntrega = this.transformDate(entrega.dataEntrega);
    console.log(entrega)
    return this.http.put<Entrega>(url, entrega, this.httpOptions);
  }

  transformDate(dateString: string): string {
    // Parse the date string and get the individual parts
    const [year, month, day] = dateString.split("-").map(x => parseInt(x, 10));
  
    // Create a date object
    const date = new Date(year, month - 1, day);
  
    // Format the date as "dd-mm-yyyy"
    const dataTrac = date.toLocaleDateString("pt-PT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
    return dataTrac.replace("/","-").replace("/","-")
  }
}
