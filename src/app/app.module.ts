import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core-module/core.module';
import { SharedModule } from './shared-module/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent, SignUpComponent } from './components';
import { RoomSelectionComponent } from './components/room-selection/room-selection.component';
import { RoomComponent } from './components/room/room.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { LoginService } from './services';
import { AuthGuard } from './auth.guard';
import { PostComponent } from './components/post/post.component';
import { ModalComponent } from './components/modal/modal.component';
import { CreationComponent } from './components/creation/creation.component';
import { RoomModuleComponent } from './components/room-module/room-module.component';
import { UpdateRoomComponent } from './components/update-room/update-room.component';
import { SafeHTMLPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    RoomSelectionComponent,
    RoomComponent,
    PostComponent,
    ModalComponent,
    CreationComponent,
    RoomModuleComponent,
    UpdateRoomComponent,
    SafeHTMLPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot()
  ],
  providers: [LoginService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
