import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import {
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatInputModule
} from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { NgxCaptchaModule } from 'ngx-captcha';

import { CreatePasswordPage } from './create-password.page';

const routes: Routes = [
  {
    path: '',
    component: CreatePasswordPage
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
  declarations: [CreatePasswordPage]
})
export class CreatePasswordPageModule {}
