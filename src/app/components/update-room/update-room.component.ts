import { Component, Input, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { Room } from "src/app/shared-module/models/user";

@Component({
  selector: "app-update-room",
  templateUrl: "./update-room.component.html",
  styleUrls: ["./update-room.component.scss"],
})
export class UpdateRoomComponent implements OnInit {
  @Input() currentRoom: Room;
  roomNameInput: string = "";
  bioInput: string = "";
  imageURLInput = "";

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toaster: ToasterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  }

  setInputs() {
    this.roomNameInput = this.currentRoom.roomName;
    this.bioInput = this.currentRoom.bio;
    this.imageURLInput = this.currentRoom.imageURL;
  }

  postUpdatedRoom(): void {
    this.currentRoom.roomName = this.roomNameInput;
    this.currentRoom.bio = this.bioInput;
    this.currentRoom.imageURL = this.imageURLInput;
    this.loginService.updateRoom(this.currentRoom).subscribe(
      () => {
        this.loginService.emitNewRoom(this.currentRoom);
      },
      (err) => this.handleError(err.error.error[0]),
      () => {}
    );
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }
}
