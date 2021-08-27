import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { ThrowStmt } from "@angular/compiler";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { Constants } from "src/app/shared-module/constants/constants";
import {
  Category,
  readPost,
  strawPollReceived,
  strawPollSent,
  writePost,
} from "src/app/shared-module/models/user";

@Component({
  selector: "app-creation",
  templateUrl: "./creation.component.html",
  styleUrls: ["./creation.component.scss"],
  animations: [
    // the fade-in/fade-out animation.
    trigger("simpleFadeAnimation", [
      // the "in" style determines the "resting" state of the element when it is visible.
      state("in", style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(":enter", [style({ opacity: 0 }), animate(100)]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(":leave", animate(100, style({ opacity: 0 }))),
    ]),
  ],
})
export class CreationComponent implements OnInit {
  @Input("index") postsLength: number;
  @Input("roomID") roomID: number;
  @Output() cat: EventEmitter<readPost> = new EventEmitter<readPost>();
  messageInput: string = "";
  titleInput: string = "";
  imageInput: string = "";
  categoryInputID: number = 0;
  categoryInputName: string = "Category";
  show: boolean = false;
  showPoll: boolean = false;
  answerList: string[] = ["", "", ""];
  question: string = "";
  manyAnswers: boolean = false;
  anonymous: boolean = false;

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {}

  toggleShowCreation(): void {
    this.show = !this.show;
  }

  toggleShowPoll(): void {
    this.showPoll = !this.showPoll;
  }
  get showPollCreation(): boolean {
    return this.showPoll;
  }

  get showCreation(): boolean {
    return this.show;
  }

  get canDelete(): boolean {
    return this.answerList.length !== 1;
  }

  addAnswerChoice(): void {
    this.answerList.push("");
  }

  deleteAnswerChoice(): void {
    this.answerList.pop();
  }

  trackByIndex(index: number, item: string): number {
    return index;
  }

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

  get canPost(): boolean {
    return (
      this.messageInput.trim().length != 0 &&
      this.titleInput.trim().length != 0 &&
      this.categoryInputID != 0
    );
  }

  postPost(): void {
    if (this.canPost) {
      const post: writePost = {
        title: this.titleInput,
        image: this.findImageURL,
        message: this.messageInput,
        rating: 5,
        createdBy:
          this.loginService.loggedIn() === "session"
            ? this.UserFromSessionStorage
            : this.UserFromLocalStorage,
        createdDate: new Date(),
        categoryID: this.categoryInputID,
        roomID: this.roomID,
      };
      // console.log(post);

      this.loginService.addPost(post).subscribe(
        (reedpost: readPost) => {
          console.log(reedpost);
          this.cat.next(reedpost);
        },
        (err) => this.handleError(err.error.error[0])
      );

      this.messageInput = "";
      this.titleInput = "";
      this.imageInput = "";
      this.show = false;
      this.categoryInputID = 0;
      this.categoryInputName = "Category";
    }
  }

  postPoll(): void {
    const poll: strawPollSent = {
      poll: {
        answers: this.answerList,
        enter_name: !this.anonymous,
        ma: this.manyAnswers,
        title: this.question,
      },
    };
    this.toggleShowPoll();
    //console.log(poll);

    this.loginService.makeStrawPoll(poll).subscribe(
      (straw: strawPollReceived) => {
        this.titleInput = straw.admin_key;
        this.messageInput = straw.content_id;
        this.postPost();
        this.answerList = ["", "", ""];
        this.question = "";
        this.manyAnswers = false;
        this.anonymous = false;
      },
      (err) => this.handleError(err.error.error[0])
    );
  }

  get canPostPoll(): boolean {
    return (
      this.question.trim().length !== 0 &&
      this.answerList[0].trim().length !== 0
    );
  }

  get findImageURL(): string {
    if (this.imageInput.trim().length != 0) {
      return this.imageInput;
    }
    return this.loginService.randomImageURL();
  }

  get UserFromSessionStorage(): number {
    return JSON.parse(sessionStorage.getItem(Constants.session.user)).userID;
  }

  get UserFromLocalStorage(): number {
    return JSON.parse(localStorage.getItem(Constants.session.user)).userID;
  }
  private handleError(message: string): void {
    console.log(message);
    this.toaster.showError(message);
  }

  setCategory(category: number): void {
    this.categoryInputID = category;
    switch (category) {
      case 0:
        this.categoryInputName = "Category";
        break;
      case 1:
        this.categoryInputName = "Food";
        break;
      case 2:
        this.categoryInputName = "Travel";
        break;
      case 3:
        this.categoryInputName = "Hangout";
        break;
      case 4:
        this.categoryInputName = "Poll";
        break;
    }
  }
}
