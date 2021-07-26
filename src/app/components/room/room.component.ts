import { Component, OnInit } from '@angular/core';
import {readPost, User, writePost } from 'src/app/shared-module/models/user';
import { LoginService } from 'src/app/services';
import { Constants } from 'src/app/shared-module/constants/constants';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core-module/services';
import { isJSDocThisTag } from 'typescript';


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  messageInput: string = "";
  posts: readPost[] = [];
  titleInput: string = "";
  imageInput: string = "";

  constructor(private loginService: LoginService, private toaster: ToasterService, private router: Router) {
    this.getPosts();
   }

  ngOnInit(): void {
  }

  getPosts(): void{
    this.loginService.testGetPosts().subscribe(
      (post:readPost[])=>this.posts = post,
      // (post: Post)=>{console.log("I GOT THIS POST", post),
      (err) => this.handleError(err.error.Error[0]),
      ()=>{console.log(this.posts)}
    );
  }

  getUser(userID:number): void{
    this.loginService.getUserForPost(userID).subscribe(
      (user:User)=>console.log(user),
      (err) => this.handleError(err.error.Error[0])
    );
  }
  get findImageURL(): string{
    if(this.imageInput.trim().length != 0){
      return this.imageInput;
    }
    return "https://cdn.discordapp.com/attachments/168572195075915776/858518609424154654/masters.PNG"

  }

  // get listLength():number {
  //   return this.length;
  // }

  postPost(): void{
    if(this.canPost){

      const post: writePost = {
      title: this.titleInput,
      image: this.findImageURL,
      message: this.messageInput,
      rating: 5,
      createdBy: this.loginService.loggedIn() === "session" ?  this.UserFromSessionStorage: this.UserFromLocalStorage,
      createdDate: new Date()
      }
      this.loginService.addPost(post).subscribe(
        (post:readPost)=>{
          for (let i = 0; i < this.posts.length; i++){
            if(post.rating > this.posts[i].rating){
              this.posts.splice(i,0, post);
              return;
            }
          }
        },
        (err) => this.handleError(err.error.Error[0])
      );

      this.messageInput = "";
      this.titleInput = "";
      this.imageInput = "";
      // this.length += 1;
    }
  }

  get UserFromSessionStorage(): number{
    return JSON.parse(sessionStorage.getItem(Constants.session.user)).userID;
  }

  get UserFromLocalStorage(): number {
    return JSON.parse(localStorage.getItem(Constants.session.user)).userID;
  }

  deletePost(postID: number, index:number):void {
    this.loginService.deletePost(postID).subscribe(
      ()=>{},
      (err)=> this.handleError(err.error.Error[0])
    );
    this.posts.splice(index,1);
    // this.length -=1;
  }

  private handleError(message: string): void {
    console.log(message);
    this.toaster.showError(message);
  }

  get canPost(): boolean {
    return this.messageInput.trim().length != 0 && this.titleInput.trim().length != 0;
  }


  timePosted(postedDate: Date):string {
    let currentDate = new Date();
    postedDate = new Date(postedDate);

    let days = Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(postedDate.getFullYear(), postedDate.getMonth(), postedDate.getDate()) ) /(1000 * 60 * 60 * 24));
    if(days == 1){
      return `${days} day ago`;
    }
    return `${days} days ago`;
  }

  upvote(index: number): void {
    this.posts[index].rating += 1;
    this.loginService.updatePost(this.posts[index]).subscribe(
      ()=>{},
      (err) => this.handleError(err.error.Error[0])
    );
    while(this.posts[index - 1].rating < this.posts[index].rating){
      let temp = this.posts[index - 1];
      this.posts[index - 1] = this.posts[index];
      this.posts[index] = temp;
      index -= 1;
    }

  }
  downvote(index: number): void {
    this.posts[index].rating -= 1;
    this.loginService.updatePost(this.posts[index]).subscribe(
      ()=>{},
      (err) => this.handleError(err.error.Error[0])
    );
    while(this.posts[index + 1].rating > this.posts[index].rating){
      let temp = this.posts[index + 1];
      this.posts[index + 1] = this.posts[index];
      this.posts[index] = temp;
      index += 1;
    }

  }
  update(): void{

  }
}
