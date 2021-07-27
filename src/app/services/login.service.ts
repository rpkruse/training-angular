import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { readPost, User, UserLogin, writePost } from 'src/app/shared-module/models/user';
import { environment } from 'src/environments/environment';
import { Constants } from '../shared-module/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _baseUrl: string = `${environment.baseUrl}`;    //`${environment.baseUrl}`; // TODO: Call from env file

  constructor(private http: HttpClient) { }

  postLoginAttempt(userLogin: UserLogin): Observable<User> {
    return this.http.post(`${this._baseUrl}/users/login`, userLogin) as Observable<User>;
  }

  postLoginCreation(userLogin: UserLogin): Observable<User> {
    return this.http.post(`${this._baseUrl}/users`, userLogin) as Observable<User>;
  }

  testGetPosts(): Observable<readPost[]> {
    return this.http.get(`${this._baseUrl}/posts`) as Observable<readPost[]>;
  }

  getUserForPost(userID: number): Observable<User> {
    return this.http.get(`${this._baseUrl}/users/${userID}`) as Observable<User>;
  }

  addPost(post: writePost): Observable<readPost>{
    return this.http.post(`${this._baseUrl}/posts`, post) as Observable<readPost>;
  }

  deletePost(postID: number): Observable<readPost> {
    return this.http.delete(`${this._baseUrl}/posts/byPID/${postID}`) as Observable<readPost>;
  }

  loggedIn(): string{
    if(!!sessionStorage.getItem(Constants.session.user)){
      return "session"
    } else if (!!localStorage.getItem(Constants.session.user)){
      return "local"
    }
    return "none"
    // return !!(sessionStorage.getItem(Constants.session.user) || localStorage.getItem(Constants.session.user))
  }

  updatePost(post: readPost): Observable<readPost> {
    return this.http.put(`${this._baseUrl}/posts`,post) as Observable<readPost>
  }

}
