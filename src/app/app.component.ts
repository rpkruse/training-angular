import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Constants } from './shared-module/constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentRoute: string
  constructor(private router: Router){}
  ngOnInit():void{
    this.router.events.subscribe(val => {
      if (val instanceof NavigationEnd){
      this.currentRoute = val.url;
   }});
  }
  get showNavbar(): boolean{
    return this.currentRoute !== `/${Constants.uiRoutes.login}` && this.currentRoute !== `/${Constants.uiRoutes.signup}`;
  }
  title = 'training-angular';
  logout():void{
    sessionStorage.removeItem(Constants.session.user);
    localStorage.removeItem(Constants.session.user)
  }

  get userFromStorage():string{
    if(!!sessionStorage.getItem(Constants.session.user)){
      return JSON.parse(sessionStorage.getItem(Constants.session.user)).username
    } else if (!!localStorage.getItem(Constants.session.user)){
      return JSON.parse(localStorage.getItem(Constants.session.user)).username
    }
    return ""
  }
}

