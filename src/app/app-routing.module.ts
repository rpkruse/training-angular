import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./auth.guard";
import {
  LoginComponent,
  RoomSelectionComponent,
  SignUpComponent,
} from "./components";
import { RoomComponent } from "./components/room/room.component";
import { RoomAuthGuard } from "./room-auth.guard";
import { Constants } from "./shared-module/constants/constants";

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
    canActivate: [AuthGuard],
  },
  {
    path: `${Constants.uiRoutes.board}/:roomID`,
    component: RoomComponent,
    canActivate: [AuthGuard, RoomAuthGuard],
  },
  {
    path: "**",
    redirectTo: Constants.uiRoutes.login,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
