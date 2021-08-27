import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { Constants } from "src/app/shared-module/constants/constants";
import {
  inputModel,
  readPost,
  strawPollDeletion,
} from "src/app/shared-module/models/user";

@Component({
  selector: "app-post",
  templateUrl: "./post.component.html",
  styleUrls: ["./post.component.scss"],
  animations: [
    // the fade-in/fade-out animation.ks
    trigger("simpleFadeAnimation", [
      // the "in" style determines the "resting" state of the element when it is visible.
      state("in", style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(":enter", [style({ opacity: 0 }), animate(150)]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(":leave", animate(150, style({ opacity: 0 }))),
    ]),
  ],
})
export class PostComponent implements OnInit {
  @Output() upvoted: EventEmitter<number> = new EventEmitter<number>();
  @Output() downvoted: EventEmitter<number> = new EventEmitter<number>();
  @Output() removed: EventEmitter<number> = new EventEmitter<number>();
  @Output() updatedIndex: EventEmitter<inputModel> =
    new EventEmitter<inputModel>();
  @Input() post: readPost;
  @Input() index: number;

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {}

  findButtonColor(colorID: number): string {
    switch (colorID) {
      case 0:
        return "light";
      case 1:
        return "success";
      case 2:
        return "orange";
      case 3:
        return "pink";
      case 4:
        return "blue";
    }
  }
  get isPoll(): boolean {
    return this.post.category.categoryID === 4;
  }

  get pollID(): string {
    return `https://strawpoll.com/embed/${this.post.message}`;
  }

  timePosted(postedDate: Date): string {
    let currentDate = new Date();
    postedDate = new Date(postedDate);

    let days = Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          postedDate.getFullYear(),
          postedDate.getMonth(),
          postedDate.getDate()
        )) /
        (1000 * 60 * 60 * 24)
    );
    if (days === 0) {
      return `${Math.floor(
        Math.abs(postedDate.getTime() - currentDate.getTime()) / 36e5
      )} hours ago`;
    }
    if (days === 1) {
      return `${days} day ago`;
    }
    return `${days} days ago`;
  }

  upvote(index: number): void {
    this.upvoted.next(index);
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }
  updated(inputted: inputModel): void {
    this.updatedIndex.next(inputted);
  }

  downvote(index: number): void {
    this.downvoted.next(index);
  }

  deletePost(postID: number, index: number): void {
    this.loginService.deletePost(postID).subscribe(
      () => {
        this.removed.next(index);
      },
      (err) => this.handleError(err.error.error[0])
    );
  }

  isCurrentUser(index: number): boolean {
    let log = this.loginService.loggedIn();

    if (log == "session") {
      return (
        this.post.user.userID ===
        JSON.parse(sessionStorage.getItem(Constants.session.user)).userID
      );
    } else if (log == "local") {
      return (
        this.post.user.userID ===
        JSON.parse(localStorage.getItem(Constants.session.user)).userID
      );
    }
    return false;
  }
}
