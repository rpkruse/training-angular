import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/core-module/services';
import { LoginService } from 'src/app/services';
import { Constants } from 'src/app/shared-module/constants/constants';
import { User, UserLogin } from 'src/app/shared-module/models/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  usernameInput: string = '';
  passwordInput: string = '';
  passwordReEnter: string ='';

  constructor(private loginService: LoginService, private toaster: ToasterService, private router: Router) { }

  ngOnInit(): void {
  }

  createLogin(): void {
    const userLogin: UserLogin = {
      username: this.usernameInput,
      password: this.passwordInput
    };

    this.loginService.postLoginCreation(userLogin).subscribe(
      (user: User) => console.log('I CREATED THIS USER!!!', user),
      (err) => this.handleError(err.error.Error[0]),
      ()=>this.router.navigate([Constants.uiRoutes.board])
    );

  }

  private handleError(message: string): void {
    console.log(message);
    this.toaster.showError(message);
  }

  canSignUp(): boolean {
    return this.passwordInput === this.passwordReEnter && this.passwordInput.length > 0;
  }
}
