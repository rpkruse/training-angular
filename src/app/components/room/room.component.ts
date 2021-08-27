import { Component, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import {
  Category,
  inputModel,
  readPost,
  Room,
  User,
  writePost,
} from "src/app/shared-module/models/user";
import { LoginService } from "src/app/services";
import { Constants } from "src/app/shared-module/constants/constants";
import { ActivatedRoute, Router } from "@angular/router";
import { ToasterService } from "src/app/core-module/services";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { StringMap } from "@angular/compiler/src/compiler_facade_interface";
import { Subject, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
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
export class RoomComponent implements OnInit, OnDestroy {
  public currentRoom: Room = {
    roomID: 0,
    roomName: "",
    password: "",
    bio: "",
    imageURL: "",
  };
  public currentRoomID: number;
  separateMessageInput: string = "";
  separateTitleInput: string = "";
  separateImageURL: string = "";
  separateCategoryInputName: string = "Category";
  separateCategoryInputID: number = 0;
  posts: readPost[] = [];
  messageInput: string = "";
  titleInput: string = "";
  imageInput: string = "";
  categoryInputID: number = 0;
  categoryInputName: string = "Category";
  show: boolean = false;
  buttonColor: string = "success";
  upvoteDebounce: Subject<number> = new Subject<number>();
  downvoteDebounce: Subject<number> = new Subject<number>();
  // upvoteDebounce: EventEmitter<number> = new EventEmitter<number>();
  // downvoteDebounce: EventEmitter<number> = new EventEmitter<number>();
  upvoteDebounceSubscription: Subscription;
  downvoteDebounceSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void{
    this.upvoteDebounceSubscription.unsubscribe();
    this.downvoteDebounceSubscription.unsubscribe();
  }

  ngOnInit(): void {
    let RID = parseInt(this.route.snapshot.paramMap.get("roomID"));
    this.currentRoomID = RID;
    this.getRoom(this.currentRoomID);
    //console.log(this.currentRoomID);
    this.getPosts();
    this.loginService.updatedRoomEmitter.subscribe((room: Room) => {
      this.currentRoom = room;
      this.currentRoomID = this.currentRoom.roomID;
    });
    this.upvoteDebounceSubscription = this.upvoteDebounce.pipe(debounceTime(250)).subscribe((i: number)=>this.upvote(i));
    this.downvoteDebounceSubscription = this.downvoteDebounce.pipe(debounceTime(250)).subscribe((i: number)=>this.downvote(i));
  }

  getPosts(): void {
    this.loginService.getPostsFromRoom(this.currentRoomID).subscribe(
      (post: readPost[]) => (this.posts = post.sort((a, b) => (a.rating < b.rating ? 1 : -1))),
      (err) => this.handleError(err.error.error[0]),
      () => {
        //console.log(this.posts);
      }
    );
  }

  setSeparateInputs(
    title: string,
    message: string,
    url: string,
    categoryID: number
  ): void {
    this.separateMessageInput = message;
    this.separateCategoryInputID = categoryID;
    this.setSeparateCategory(categoryID);
    this.separateTitleInput = title;
    this.separateImageURL = url;
  }

  getRoom(roomID: number): void {
    this.loginService.getRoomByRoomID(roomID).subscribe(
      (room: Room) => (this.currentRoom = room),
      (err) => this.handleError(err.error.error[0]),
      () => {}
    );
  }

  findButtonColor(colorID: number): string {
    switch (colorID) {
      case 0:
        return "light";
      case 1:
        return "success";
      case 2:
        return "blue";
      case 3:
        return "pink";
      case 4:
        return "orange";
    }
  }

  isCurrentUser(index: number): boolean {
    let log = this.loginService.loggedIn();

    if (log == "session") {
      return (
        this.posts[index].user.userID ===
        JSON.parse(sessionStorage.getItem(Constants.session.user)).userID
      );
    } else if (log == "local") {
      return (
        this.posts[index].user.userID ===
        JSON.parse(localStorage.getItem(Constants.session.user)).userID
      );
    }
    return false;
  }

  get showCreation(): boolean {
    return this.show;
  }

  toggleShowCreation(): void {
    this.show = !this.show;
  }

  getUser(userID: number): void {
    this.loginService.getUserForPost(userID).subscribe(
      (
          user: User //console.log(user),
        ) =>
        (err) =>
          this.handleError(err.error.error[0])
    );
  }
  get findImageURL(): string {
    if (this.imageInput.trim().length != 0) {
      return this.imageInput;
    }
    return "https://cdn.discordapp.com/attachments/168572195075915776/858518609424154654/masters.PNG";
  }

  get findSeparateImageURL(): string {
    if (this.separateImageURL.trim().length != 0) {
      return this.separateImageURL;
    }
    return "https://cdn.discordapp.com/attachments/168572195075915776/858518609424154654/masters.PNG";
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
        roomID: this.currentRoom.roomID,
      };

      this.loginService.addPost(post).subscribe(
        (post: readPost) => {
          for (let i = 0; i < this.posts.length; i++) {
            if (post.rating > this.posts[i].rating) {
              this.posts.splice(i, 0, post);
              this.posts[i].category = {
                categoryID: this.categoryInputID,
                name: this.categoryInputName,
              };
              return;
            }
          }
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

  get UserFromSessionStorage(): number {
    return JSON.parse(sessionStorage.getItem(Constants.session.user)).userID;
  }

  get UserFromLocalStorage(): number {
    return JSON.parse(localStorage.getItem(Constants.session.user)).userID;
  }

  deletePost(postID: number, index: number): void {
    this.loginService.deletePost(postID).subscribe(
      () => {},
      (err) => this.handleError(err.error.error[0])
    );
    this.posts.splice(index, 1);
  }
  removed(index: number): void {
    this.posts.splice(index, 1);
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }

  get canPost(): boolean {
    return (
      this.messageInput.trim().length != 0 &&
      this.titleInput.trim().length != 0 &&
      this.categoryInputID != 0
    );
  }

  get canUpdate(): boolean {
    return (
      this.separateMessageInput.trim().length != 0 &&
      this.separateTitleInput.trim().length != 0 &&
      this.separateCategoryInputID != 0
    );
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
    if (days == 1) {
      return `${days} day ago`;
    }
    return `${days} days ago`;
  }

  upvote(index: number): void {
    this.posts[index].rating += 1;

    this.loginService
      .upvotePost(this.posts[index], this.UserFromSessionStorage)
      .subscribe(
        () => {
          this.posts.sort((a, b) => (a.rating < b.rating ? 1 : -1));
          // this.getPosts();
          // if (index != 0) {
          //   while (
          //     index > 0 &&
          //     this.posts[index - 1].rating < this.posts[index].rating
          //   ) {
          //     let temp = this.posts[index - 1];
          //     this.posts[index - 1] = this.posts[index];
          //     this.posts[index] = temp;
          //     index -= 1;
          //   }
          // }
        },
        (err) => {
          this.handleError(err.error.error[0]);
          this.posts[index].rating -= 1;
        }
      );
  }

  upvoted(index: number): void {
    this.upvoteDebounce.next(index);
  }

  downvoted(index: number): void {
    this.downvoteDebounce.next(index);
  }

  downvote(index: number): void {
    this.posts[index].rating -= 1;
    this.loginService
      .downvotePost(this.posts[index], this.UserFromSessionStorage)
      .subscribe(
        () => {
          this.posts.sort((a, b) => (a.rating < b.rating ? 1 : -1));
          // this.getPosts();
          // if (index < this.posts.length - 1) {
          //   while (
          //     index < this.posts.length - 1 &&
          //     this.posts[index + 1].rating > this.posts[index].rating
          //   ) {
          //     let temp = this.posts[index + 1];
          //     this.posts[index + 1] = this.posts[index];
          //     this.posts[index] = temp;
          //     index += 1;
          //   }
          // }
        },
        (err) => {
          this.handleError(err.error.error[0]);
          this.posts[index].rating += 1;
        }
      );
    if (this.posts[index].rating < 0) {
      this.deletePost(this.posts[index].postID, index);
    }
  }
  update(index: number): void {
    //console.log(this.posts[index]);

    this.posts[index].category = {
      categoryID: this.separateCategoryInputID,
      name: this.separateCategoryInputName,
    };
    this.posts[index].image = this.findSeparateImageURL;
    this.posts[index].message = this.separateMessageInput;
    this.posts[index].title = this.separateTitleInput;

    //console.log(this.posts[index]);
    this.loginService.updatePost(this.posts[index]).subscribe(
      () => {},
      (err) => this.handleError(err.error.error[0])
    );
  }

  updated(inputted: inputModel) {
    this.posts[inputted.index].category = inputted.category;
    this.posts[inputted.index].image = inputted.image;
    this.posts[inputted.index].message = inputted.message;
    this.posts[inputted.index].title = inputted.title;
  }
  reHeap(post: readPost): void {
    console.log(post);
    console.log(this.posts);
    this.posts.push(post);
    this.posts.sort((a, b) => (a.rating < b.rating ? 1 : -1));
    // for (let i = 0; i < this.posts.length; i++) {
    //   if (post.rating >= this.posts[i].rating) {
    //     this.posts.splice(i, 0, post);
    //     this.posts[i].category = post.category;
    //     return;
    //   }
    // }
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

  setSeparateCategory(category: number): void {
    this.separateCategoryInputID = category;
    switch (category) {
      case 0:
        this.separateCategoryInputName = "Category";
        break;
      case 1:
        this.separateCategoryInputName = "Food";
        break;
      case 2:
        this.separateCategoryInputName = "Travel";
        break;
      case 3:
        this.separateCategoryInputName = "Hangout";
        break;
      case 4:
        this.separateCategoryInputName = "Poll";
        break;
    }
  }
}
