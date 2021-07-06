import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core-module/services';
import { User, UserLogin } from 'src/app/shared-module/models/user';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usernameInput: string = '';
  passwordInput: string = '';

  constructor(private loginService: LoginService, private toaster: ToasterService) { }

  ngOnInit(): void { }

  /*
    TODO: Try to do the form stuff with angular reactive forms
  */
  login(): void {
    const userLogin: UserLogin = {
      username: this.usernameInput,
      password: this.passwordInput
    };

    this.loginService.postLoginAttempt(userLogin).subscribe(
      (user: User) => console.log('I GOT THIS USER!!!', user),
      (err) => this.handleError(err.error.Error[0])
    );
  }

  get canLogin(): boolean {
    return this.usernameInput.trim().length > 0 && this.passwordInput.trim().length > 0;
  }

  private handleError(message: string): void {
    console.log(message);
    this.toaster.showError(message);
  }
}
