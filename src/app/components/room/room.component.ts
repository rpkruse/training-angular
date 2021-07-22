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
  posts: readPost[];

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
    // console.log(this.posts);
  }

  getUser(userID:number): void{
    this.loginService.getUserForPost(userID).subscribe(
      (user:User)=>console.log(user),
      (err) => this.handleError(err.error.Error[0])
    );
  }

  get displayUser():String {
    return String(this.getUser(this.UserFromSessionStorage));
  }

  postPost(): void{
    if(this.canPost){

      const post: writePost = {
      message: this.messageInput,
      rating: 0,
      createdBy: this.UserFromSessionStorage,
      createdDate: new Date()
      }
      this.loginService.addPost(post).subscribe(
        (post:readPost)=>this.posts.push(post),
        (err) => this.handleError(err.error.Error[0])
      );

      this.messageInput = "";
    }
  }

  get UserFromSessionStorage(): number{
    return JSON.parse(sessionStorage.getItem("user")).userID;
  }

  deletePost(postID: number, index:number):void {
    this.loginService.deletePost(postID).subscribe(
      ()=>{},
      (err)=> this.handleError(err.error.Error[0])
    );
    this.posts.splice(index,1)
  }

  private handleError(message: string): void {
    console.log(message);
    this.toaster.showError(message);
  }

  get canPost(): boolean {
    return this.messageInput.trim().length != 0;
  }


  timePosted(postedDate: Date):string {
    let date = new Date(postedDate);
    let currentDate = new Date();


    let days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24) * -1;
    if(days == 1){
      return `${days} day ago`
    }
    return `${days} days ago`

  }
}
