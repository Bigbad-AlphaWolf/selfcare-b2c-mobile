import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewRegistrationPage } from './new-registration.page';
import { SharedModule } from 'src/shared/shared.module';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { MatBottomSheetModule, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { Network } from '@ionic-native/network/ngx';

const routes: Routes = [
  {
    path: '',
    component: NewRegistrationPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MatBottomSheetModule,
    RouterModule.forChild(routes),
  ],
  declarations: [NewRegistrationPage],
  providers: [OpenNativeSettings, Network],
})
export class NewRegistrationPageModule {}
