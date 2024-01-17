import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subscription } from 'rxjs';
import { User } from '../users/user';
import config from '../../config'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = config.authz.url + '/api/utilizador';

  httpOptions = {
    headers: new HttpHeaders({ 'Authorization': 'my-auth-token', 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }



  listarUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl, { observe: 'body', responseType: 'json' });
  }

  listarUser(email: string): Observable<User> {
    const url = `${this.userUrl}/email/${email}`;

    return this.http.get<User>(url, { observe: 'body', responseType: 'json' }).
      pipe(
        map(
          data => {
            return new User(
              data['primeiroNome'],
              data['ultimoNome'],
              data['email'],
              data['numeroTelemovel'],
              data['cargo'],
              data['ativo']
            );
          }
        )
      );
  }


  editarUser(user: User): Observable<User> {
    const url = `${this.userUrl}`;
    user.ativo = false;
    return this.http.put<User>(url, user, this.httpOptions);
  }

}