import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { inputModel, readPost } from "src/app/shared-module/models/user";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
})
export class ModalComponent implements OnInit {
  @Input("post") post: readPost;
  @Input("index") i: number;
  @Output() updated: EventEmitter<inputModel> = new EventEmitter<inputModel>();
  separateMessageInput: string = "";
  separateTitleInput: string = "";
  separateImageURL: string = "";
  separateCategoryInputName: string = "Category";
  separateCategoryInputID: number = 0;

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {}

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

  update(index: number): void {
    const inputted = {
      index: index,
      category: {
        categoryID: this.separateCategoryInputID,
        name: this.separateCategoryInputName,
      },
      image: this.findSeparateImageURL,
      message: this.separateMessageInput,
      title: this.separateTitleInput,
    };
    this.post.category = {
      categoryID: this.separateCategoryInputID,
      name: this.separateCategoryInputName,
    };
    this.post.image = this.findSeparateImageURL;
    this.post.message = this.separateMessageInput;
    this.post.title = this.separateTitleInput;

    this.loginService.updatePost(this.post).subscribe(
      () => {
        this.updated.next(inputted);
      },
      (err) => this.handleError(err.error.error[0])
    );
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }

  get findSeparateImageURL(): string {
    if (this.separateImageURL.trim().length != 0) {
      return this.separateImageURL;
    }
    return "https://cdn.discordapp.com/attachments/168572195075915776/858518609424154654/masters.PNG";
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

  get canUpdate(): boolean {
    return (
      this.separateMessageInput.trim().length != 0 &&
      this.separateTitleInput.trim().length != 0 &&
      this.separateCategoryInputID != 0
    );
  }
}
