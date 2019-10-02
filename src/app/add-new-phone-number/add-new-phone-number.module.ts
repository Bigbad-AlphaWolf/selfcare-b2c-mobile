import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddNewPhoneNumberPage } from './add-new-phone-number.page';
import { SharedModule } from 'src/shared/shared.module';
import { NgxCaptchaModule } from 'ngx-captcha';

const routes: Routes = [
  {
    path: '',
    component: AddNewPhoneNumberPage
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
  declarations: [AddNewPhoneNumberPage]
})
export class AddNewPhoneNumberPageModule {}
