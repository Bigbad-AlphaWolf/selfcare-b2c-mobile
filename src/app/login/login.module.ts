import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LoginPage } from './login.page';

import {
  MatCheckboxModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatBottomSheetModule,
} from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatInputModule,
    IonicModule,
    SharedModule,
    MatBottomSheetModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LoginPage],
  providers: [OpenNativeSettings],
})
export class LoginPageModule {}
