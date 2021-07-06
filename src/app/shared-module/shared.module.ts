import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from './primeng/primeng.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrimengModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    CommonModule,
    PrimengModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
