import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CheckNumberPage } from './check-number.page';

import {
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatInputModule
} from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { NgxCaptchaModule } from 'ngx-captcha';
const routes: Routes = [
  {
    path: '',
    component: CheckNumberPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatInputModule,
    SharedModule,
    NgxCaptchaModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CheckNumberPage]
})
export class CheckNumberPageModule {}
