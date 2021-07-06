import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from './services';
import { MessageService } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ToasterService,
    MessageService
  ]
})
export class CoreModule { }
