import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Inject, LOCALE_ID } from '@angular/core';
import config from 'src/config';
import { User } from '../profile/utilizador';

@Injectable({
  providedIn: 'root',
})
export class UtilizadorService {
  private authzURL = config.authz.url + '/api/utilizador'; // URL to web api

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    @Inject(LOCALE_ID) public locale: string
  ) { }

  verificarExistencia(email: string): Observable<User> {
    const url = `${this.authzURL}/email/${email}`;

    return this.http
      .get<User>(url, { observe: 'body', responseType: 'json' })
      .pipe(
        map((data) => {
          return new User(
            data['primeiroNome'],
            data['ultimoNome'],
            data['email'],
            data['cargo'],
            data['numeroTelemovel'],
          );
        })
      );
  }

  adicionarUtilizador(utilizador: User): Observable<User> {
    return this.http.post<User>(this.authzURL, utilizador, this.httpOptions);
  }

  accessToken(email: string): Observable<string> {
    const url = `${this.authzURL}/accessToken/${email}`;
    return this.http.get<string>(url, this.httpOptions)
  }
}
