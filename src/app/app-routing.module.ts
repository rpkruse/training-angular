import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Constants } from './shared-module/constants/constants';


const routes: Routes = [
  {
    path: Constants.uiRoutes.login,
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
