import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginService } from './services';
import { Constants } from './shared-module/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private _baseUrl: string = `${environment.baseUrl}`;
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }

  constructor (private _authServicce: LoginService, private _router: Router){ }

  canActivate(): boolean{
    if(this._authServicce.loggedIn() !== "none"){
      return true;
    } else {
      this._router.navigate([Constants.uiRoutes.login])
    }
  }

}
