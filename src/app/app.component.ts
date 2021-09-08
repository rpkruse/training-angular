import { Component, defineInjectable, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { ToasterService } from "./core-module/services";
import { LoginService } from "./services";
import { Constants } from "./shared-module/constants/constants";
import { Room } from "./shared-module/models/user";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  modalShow: boolean = false;
  currentRoute: string;
  roomNameInput: string = "";
  passwordInput: string = "";
  currentRoomID: number;
  currentRoom: Room;
  room: Room = {
    roomID: 0,
    roomName: "",
    password: "",
    bio: "",
    imageURL: "",
  };
  empty: Room = {
    roomID: 0,
    roomName: "",
    password: "",
    bio: "",
    imageURL: "",
  };

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.currentRoute = val.url;
        if (this.showSettings) {
          let RID = parseInt(this.currentRoute.split("/room/")[1]);
          this.currentRoomID = RID;
          this.getRoom(this.currentRoomID);
        }
      }
    });
  }
  get showNavbar(): boolean {
    return (
      // this.currentRoute.includes(`/${Constants.uiRoutes.board}/`) || this.currentRoute.includes(`/${Constants.uiRoutes.room}/`)
      this.currentRoute !== `/${Constants.uiRoutes.login}` &&
      this.currentRoute !== `/${Constants.uiRoutes.signup}` && this.userFromStorage!==""
    );
  }

  get showSettings(): boolean {
    return (
      this.currentRoute &&
      this.currentRoute.includes(`/${Constants.uiRoutes.board}/`)
    );
  }
  title = "BulletinBuddy";
  logout(): void {
    sessionStorage.removeItem(Constants.session.user);
    localStorage.removeItem(Constants.session.user);
  }

  getRoom(roomID: number): void {
    this.loginService.getRoomByRoomID(roomID).subscribe(
      (room: Room) => {
        this.currentRoom = room;
        //console.log(this.currentRoom);
      },
      (err) => this.handleError(err.error.error[0]),
      () => {}
    );
  }

  get userFromStorage(): string {
    if (!!sessionStorage.getItem(Constants.session.user)) {
      return JSON.parse(sessionStorage.getItem(Constants.session.user))
        .username;
    } else if (!!localStorage.getItem(Constants.session.user)) {
      return JSON.parse(localStorage.getItem(Constants.session.user)).username;
    }
    return "";
  }

  get canSearch(): boolean {
    if (this.roomNameInput.trim().length >= 0) {
      return true;
    }
    return false;
  }

  findRoomWithRoomName(name: string): boolean {
    if (!this.canSearch) {
      return false;
    }
    let output = false;
    this.loginService.getRoomByRoomName(name).subscribe(
      (room: Room) => {
        //console.log(room);
        output = true;
      },
      (err) => {
        this.handleError(err.error.error[0]);
      },
      () => {
        //console.log(this.room);
      }
    );

    return output;
  }


  loginToRoom(roomName: string, password: string) {
    this.loginService.loginToRoom(roomName, password).subscribe(
      (room: Room) => {
        this.room = room;
        this.modalShow = false;
      },
      (err) => this.handleError(err.error.error[0]),
      () => {

        //console.log(this.room);
        this.router.navigate([Constants.uiRoutes.board, this.room.roomID]);
        this.loginService.emitNewRoom(this.room);
      }
    );
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }
}
