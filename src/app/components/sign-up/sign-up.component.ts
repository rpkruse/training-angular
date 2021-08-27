import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ToasterService } from "src/app/core-module/services";
import { LoginService } from "src/app/services";
import { Constants } from "src/app/shared-module/constants/constants";
import { User, UserLogin } from "src/app/shared-module/models/user";

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  usernameInput: string = "";
  passwordInput: string = "";
  passwordReEnter: string = "";

  constructor(
    private loginService: LoginService,
    private toaster: ToasterService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  createLogin(): void {
    const userLogin: UserLogin = {
      username: this.usernameInput,
      password: this.passwordInput,
    };

    this.loginService.postLoginCreation(userLogin).subscribe(
      (user: User) =>
        sessionStorage.setItem(Constants.session.user, JSON.stringify(user)),
      (err) => this.handleError(err.error.error[0]),
      () => this.router.navigate([Constants.uiRoutes.room])
    );
  }

  private handleError(message: string): void {
    //console.log(message);
    this.toaster.showError(message);
  }

  get canSignUp(): Boolean {
    return this.passwordLongEnough && this.passwordsMatch;
  }

  get passwordLongEnough(): Boolean {
    return this.passwordInput.length > 5;
  }
  get passwordsMatch(): Boolean {
    return this.passwordInput === this.passwordReEnter;
  }
}
