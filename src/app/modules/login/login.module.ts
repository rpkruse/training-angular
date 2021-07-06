import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components';
import { LoginRoutingModule } from './login-routing.module';
import { SharedModule } from 'src/app/shared-module/shared.module';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    SharedModule,
    LoginRoutingModule,
  ]
})
export class LoginModule { }
