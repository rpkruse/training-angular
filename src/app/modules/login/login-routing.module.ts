import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Constants } from 'src/app/shared-module/constants/constants';
import { LoginComponent } from './components';

const routes: Routes = [ // /login/_____
  {
    path: Constants.uiRoutes.empty,
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
