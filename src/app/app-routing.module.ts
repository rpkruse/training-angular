import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent, RoomSelectionComponent, SignUpComponent } from './components';
import { RoomComponent } from './components/room/room.component';
import { Constants } from './shared-module/constants/constants';


const routes: Routes = [

  {
    path: Constants.uiRoutes.login,
    component: LoginComponent,
  },
  {
    path: Constants.uiRoutes.signup,
    component: SignUpComponent,
  },
  {
    path: Constants.uiRoutes.room,
    component: RoomSelectionComponent,
  },
  {
    path: Constants.uiRoutes.board,
    component: RoomComponent,
  },
  {
    path: '**',
    redirectTo: Constants.uiRoutes.login,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
