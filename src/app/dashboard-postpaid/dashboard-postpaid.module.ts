import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPostpaidPage } from './dashboard-postpaid.page';
import { SharedModule } from 'src/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardPostpaidPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardPostpaidPage],
  // schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardPostpaidPageModule {}
