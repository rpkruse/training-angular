import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { Constants } from "src/app/shared-module/constants/constants";
import { Room } from "src/app/shared-module/models/user";

@Component({
  selector: "app-room-module",
  templateUrl: "./room-module.component.html",
  styleUrls: ["./room-module.component.scss"],
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
export class RoomModuleComponent implements OnInit {
  @Input() index: number;
  @Input() firstRoom: Room;
  @Input() secondRoom: Room;
  @Input() final: boolean;
  @Output() removedIndex: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}

  navigateToRoom(second: boolean): void {
    if (second) {
      this.router.navigate([Constants.uiRoutes.board, this.secondRoom.roomID]);
    } else {
      this.router.navigate([Constants.uiRoutes.board, this.firstRoom.roomID]);
    }
  }

  test(): void {
    //console.log("test");
  }

  removeUserFromRoom(thisRoom: Room, second: boolean): void {
    if (second) {
      this.removedIndex.next(this.index + 1);
    } else {
      this.removedIndex.next(this.index);
    }
    this.loginService.removeUserFromRoom(thisRoom.roomID).subscribe(
      () => {},
      (err) => this.handleError(err.error.error[0]),
      () => {}
    );
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }
}
