import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OpenOmAccountPage } from './open-om-account.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialComponentsModule } from 'src/app/material-components/material-components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/shared/shared.module';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

const routes: Routes = [
  {
    path: '',
    component: OpenOmAccountPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    MaterialComponentsModule,
    PipesModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OpenOmAccountPage],
  providers:[OpenNativeSettings, Network]
})
export class OpenOmAccountPageModule {}
