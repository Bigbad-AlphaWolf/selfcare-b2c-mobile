import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DashboardPrepaidHybridPage } from './dashboard-prepaid-hybrid.page';
import { SharedModule } from 'src/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardPrepaidHybridPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [DashboardPrepaidHybridPage],
})
export class DashboardPrepaidHybridPageModule {}
