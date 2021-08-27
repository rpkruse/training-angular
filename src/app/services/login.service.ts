import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  readPost,
  Room,
  RoomLogin,
  RoomToAdd,
  strawPollDeletion,
  strawPollReceived,
  strawPollSent,
  User,
  UserLogin,
  UserRoom,
  writePost,
} from "src/app/shared-module/models/user";
import { environment } from "src/environments/environment";
import { Constants } from "../shared-module/constants/constants";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  images: string[] = [
    "https://mdbootstrap.com/img/Photos/Others/img%20(27).jpg",
    "https://mdbootstrap.com/img/Photos/Others/img%20(34).jpg",
    "https://mdbootstrap.com/img/Photos/Others/img (28).jpg",
    "https://mdbootstrap.com/img/Photos/Others/images/81.jpg",
    "https://mdbootstrap.com/img/Photos/Others/images/43.jpg",
    "https://mdbootstrap.com/img/Photos/Others/images/13.jpg",
  ];

  updatedRoomEmitter = new EventEmitter<Room>();

  private _baseUrl: string = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}

  emitNewRoom(uRoom: Room): void {
    this.updatedRoomEmitter.next(uRoom);
  }

  randomImageURL(): string {
    return this.images[Math.floor(Math.random() * this.images.length)];
  }

  postLoginAttempt(userLogin: UserLogin): Observable<User> {
    return this.http.post(
      `${this._baseUrl}/users/login`,
      userLogin
    ) as Observable<User>;
  }

  postLoginCreation(userLogin: UserLogin): Observable<User> {
    return this.http.post(
      `${this._baseUrl}/users`,
      userLogin
    ) as Observable<User>;
  }

  testGetPosts(): Observable<readPost[]> {
    return this.http.get(`${this._baseUrl}/posts`) as Observable<readPost[]>;
  }

  getPostsFromRoom(roomID: number): Observable<readPost[]> {
    return this.http.get(
      `${this._baseUrl}/posts/byRID/${roomID}`
    ) as Observable<readPost[]>;
  }

  getUserForPost(userID: number): Observable<User> {
    return this.http.get(
      `${this._baseUrl}/users/${userID}`
    ) as Observable<User>;
  }

  addPost(post: writePost): Observable<readPost> {
    return this.http.post(
      `${this._baseUrl}/posts`,
      post
    ) as Observable<readPost>;
  }

  deletePost(postID: number): Observable<readPost> {
    return this.http.delete(
      `${this._baseUrl}/posts/byPID/${postID}`
    ) as Observable<readPost>;
  }

  loggedIn(): string {
    if (!!sessionStorage.getItem(Constants.session.user)) {
      return "session";
    } else if (!!localStorage.getItem(Constants.session.user)) {
      return "local";
    }
    return "none";
  }

  currentUserID(): number {
    if (!!sessionStorage.getItem(Constants.session.user)) {
      return JSON.parse(sessionStorage.getItem(Constants.session.user)).userID;
    } else if (!!localStorage.getItem(Constants.session.user)) {
      return JSON.parse(localStorage.getItem(Constants.session.user)).userID;
    }
    return -1;
  }

  updatePost(post: readPost): Observable<readPost> {
    return this.http.put(
      `${this._baseUrl}/posts`,
      post
    ) as Observable<readPost>;
  }

  upvotePost(post: readPost, userID: number): Observable<readPost> {
    return this.http.put(
      `${this._baseUrl}/posts/upvote/${userID}`,
      post
    ) as Observable<readPost>;
  }

  downvotePost(post: readPost, userID: number): Observable<readPost> {
    return this.http.put(
      `${this._baseUrl}/posts/downvote/${userID}`,
      post
    ) as Observable<readPost>;
  }

  getRooms(): Observable<Room[]> {
    return this.http.get(`${this._baseUrl}/rooms`) as Observable<Room[]>;
  }

  getRoomsByUserID(): Observable<Room[]> {
    if (this.loggedIn() == "session") {
      return this.http.get(
        `${this._baseUrl}/rooms/byUID/${
          JSON.parse(sessionStorage.getItem(Constants.session.user)).userID
        }`
      ) as Observable<Room[]>;
    }
    return this.http.get(
      `${this._baseUrl}/rooms/byUID/${
        JSON.parse(localStorage.getItem(Constants.session.user)).userID
      }`
    ) as Observable<Room[]>;
  }

  getRoomByRoomName(name: string): Observable<Room> {
    return this.http.get(
      `${this._baseUrl}/rooms/byRoomName/${name}`
    ) as Observable<Room>;
  }

  getRoomByRoomID(ID: number): Observable<Room> {
    return this.http.get(
      `${this._baseUrl}/rooms/byRID/${ID}`
    ) as Observable<Room>;
  }

  get UserFromSessionStorage(): number {
    return JSON.parse(sessionStorage.getItem(Constants.session.user)).userID;
  }

  get UserFromLocalStorage(): number {
    return JSON.parse(localStorage.getItem(Constants.session.user)).userID;
  }

  removeUserFromRoom(roomID: number): Observable<boolean> {
    const use: UserRoom = {
      userID: this.StoredUser,
      roomID: roomID,
    };

    return this.http.post(
      `${this._baseUrl}/rooms/RemoveUserRoom`,
      use
    ) as Observable<boolean>;
  }

  addRoom(room: RoomToAdd): Observable<Room> {
    return this.http.post(`${this._baseUrl}/rooms`, room) as Observable<Room>;
  }

  updateRoom(room: Room): Observable<Room> {
    return this.http.put(`${this._baseUrl}/rooms`, room) as Observable<Room>;
  }

  get StoredUser(): number {
    return this.loggedIn() === "session"
      ? this.UserFromSessionStorage
      : this.UserFromLocalStorage;
  }

  loginToRoom(roomName: string, roomPassword: string): Observable<Room> {
    const login: RoomLogin = {
      userID: this.StoredUser,
      roomName: roomName,
      password: roomPassword,
    };
    return this.http.post(
      `${this._baseUrl}/rooms/RoomLogin`,
      login
    ) as Observable<Room>;
  }

  checkUserAccess(accessor: UserRoom): Observable<boolean> {
    return this.http.post(
      `${this._baseUrl}/rooms/CanAccessRoom`,
      accessor
    ) as Observable<boolean>;
  }

  makeStrawPoll(poll: strawPollSent): Observable<strawPollReceived> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("API-KEY", environment.strawpollKey);
    return this.http.post(environment.strawpollUrl, poll, {
      headers,
    }) as Observable<strawPollReceived>;
  }

  deleteStrawPoll(pollID: string): Observable<strawPollDeletion> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append("API-KEY", environment.strawpollKey);
    const options = {
      headers: headers,
      body: {
        content_id: pollID,
      },
    };
    return this.http.delete(
      environment.strawpollDeleteUrl,
      options
    ) as Observable<strawPollDeletion>;
  }
}
