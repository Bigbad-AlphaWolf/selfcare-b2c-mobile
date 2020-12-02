import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPrepaidLightPage } from './dashboard-prepaid-light.page';
import { SharedModule } from 'src/shared/shared.module';
import { ActionLightComponent } from './components/action-light-modal/action-light/action-light.component';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardPrepaidLightPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DashboardPrepaidLightPage, ActionLightComponent],
  entryComponents: [ActionLightComponent],
})
export class DashboardPrepaidLightPageModule {}
