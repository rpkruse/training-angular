import { Component } from '@angular/core';
import { Constants } from './shared-module/constants/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'training-angular';
  logout():void{
    sessionStorage.removeItem(Constants.session.user);
  }
}
