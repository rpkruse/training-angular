import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserLogin } from 'src/app/shared-module/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _baseUrl: string = `${environment.baseUrl}/users`;    //`${environment.baseUrl}`; // TODO: Call from env file

  constructor(private http: HttpClient) { }

  postLoginAttempt(userLogin: UserLogin): Observable<User> {
    return this.http.post(`${this._baseUrl}/login`, userLogin) as Observable<User>;
  }
}
