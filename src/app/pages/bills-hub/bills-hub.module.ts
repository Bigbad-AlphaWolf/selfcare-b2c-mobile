import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BillsHubPage } from './bills-hub.page';
import { SharedModule } from 'src/shared/shared.module';
import { IonicImageLoader } from 'ionic-image-loader';

const routes: Routes = [
  {
    path: '',
    component: BillsHubPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    IonicImageLoader,
    RouterModule.forChild(routes),
  ],
  declarations: [BillsHubPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BillsHubPageModule {}
