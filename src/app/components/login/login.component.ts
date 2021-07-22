import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core-module/services';
import { LoginService } from 'src/app/services';
import { Constants } from 'src/app/shared-module/constants/constants';
import { User, UserLogin } from 'src/app/shared-module/models/user';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  usernameInput: string = '';
  passwordInput: string = '';

  constructor(private loginService: LoginService, private toaster: ToasterService, private router: Router) { }

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
      (user: User) => sessionStorage.setItem(Constants.session.user,JSON.stringify(user)),
      (err) => this.handleError(err.error.Error[0]),
      ()=>this.router.navigate([Constants.uiRoutes.room])
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
