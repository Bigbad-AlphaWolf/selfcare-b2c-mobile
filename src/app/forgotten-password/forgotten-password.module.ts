import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ForgottenPasswordPage } from './forgotten-password.page';
import { SharedModule } from 'src/shared/shared.module';
import { NgxCaptchaModule } from 'ngx-captcha';

const routes: Routes = [
  {
    path: '',
    component: ForgottenPasswordPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NgxCaptchaModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ForgottenPasswordPage]
})
export class ForgottenPasswordPageModule {}
