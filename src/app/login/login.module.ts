import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LoginPage} from './login.page';

import {SharedModule} from 'src/shared/shared.module';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';
import {MaterialComponentsModule} from '../material-components/material-components.module';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    MaterialComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginPage],
  providers: [OpenNativeSettings]
})
export class LoginPageModule {}
