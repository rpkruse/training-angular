import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { Constants } from "src/app/shared-module/constants/constants";
import { Room, RoomToAdd, UserRoom } from "src/app/shared-module/models/user";

@Component({
  selector: "app-room-selection",
  templateUrl: "./room-selection.component.html",
  styleUrls: ["./room-selection.component.scss"],
  animations: [
    // the fade-in/fade-out animation.
    trigger("simpleFadeAnimation", [
      // the "in" style determines the "resting" state of the element when it is visible.
      state("in", style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(":enter", [style({ opacity: 0 }), animate(200)]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(":leave", animate(200, style({ opacity: 0 }))),
    ]),
  ],
})
export class RoomSelectionComponent implements OnInit {
  rooms: Room[] = [];
  show: boolean = true;
  roomNameInput: string = "";
  bioInput: string = "";
  passwordInput: string = "";
  imageURLInput: string = "";

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRooms();
    this.imageURLInput = this.findImageURL;
  }

  getRooms(): void {
    this.loginService.getRoomsByUserID().subscribe(
      (roomList: Room[]) => (this.rooms = roomList),
      (err) => this.handleError(err.error.error[0]),
      () => {
        //console.log(this.rooms);
      }
    );
  }
  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }

  get findImageURL(): string {
    if (this.imageURLInput.trim().length != 0) {
      return this.imageURLInput;
    }
    return this.loginService.randomImageURL();
  }

  toggleShow(): void {
    this.show = !this.show;
  }

  get UserFromSessionStorage(): number {
    return JSON.parse(sessionStorage.getItem(Constants.session.user)).userID;
  }

  get UserFromLocalStorage(): number {
    return JSON.parse(localStorage.getItem(Constants.session.user)).userID;
  }

  get canMakeRoom(): boolean {
    return (
      this.roomNameInput.trim().length != 0 && this.bioInput.trim().length != 0
    );
  }

  removeUserFromRoom(roomID: number, index: number): void {
    //console.log(roomID);
    this.loginService.removeUserFromRoom(roomID).subscribe(
      () => {},
      (err) => this.handleError(err.error.error[0]),
      () => {
        this.rooms.splice(index, 1);
      }
    );
  }

  removed(removedIndex: number) {
    this.rooms.splice(removedIndex, 1);
  }

  postRoom(): void {
    if (this.canMakeRoom) {
      const room: RoomToAdd = {
        roomName: this.roomNameInput,
        password: this.passwordInput,
        bio: this.bioInput,
        imageURL: this.findImageURL,
        userIDS: [
          this.loginService.loggedIn() === "session"
            ? this.UserFromSessionStorage
            : this.UserFromLocalStorage,
        ],
      };
      this.loginService.addRoom(room).subscribe(
        (addedRoom: Room) => {
          this.rooms.push(addedRoom);
          //console.log(addedRoom);
        },
        (err) => this.handleError(err.error.error[0])
      );

      this.roomNameInput = "";
      this.passwordInput = "";
      this.bioInput = "";
      this.imageURLInput = "";
      this.toggleShow();
    }
  }
}
