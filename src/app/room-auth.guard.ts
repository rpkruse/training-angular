import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services';
import { Constants } from './shared-module/constants/constants';
import { UserRoom } from './shared-module/models/user';
import { map } from 'rxjs/operators';
import { ToasterService } from './core-module/services';

@Injectable({
  providedIn: 'root'
})
export class RoomAuthGuard implements CanActivate {

  constructor(private _authService: LoginService, private _router: Router, private toaster: ToasterService){
  }
  canActivate(route: ActivatedRouteSnapshot,  state: RouterStateSnapshot): Observable<boolean>{
    //console.log(route, state);

    const accessor: UserRoom={
      roomID: parseInt(route.params.roomID),

      userID: this._authService.currentUserID(),
      userRoomID: -1
    }

    return this._authService.checkUserAccess(accessor).pipe(map((hasAccess: boolean) =>{
      if(!hasAccess){
        this.toaster.showError("You are not a member of this room");
        this._router.navigate([Constants.uiRoutes.room])
      }
      return true
    }));


  }

}
