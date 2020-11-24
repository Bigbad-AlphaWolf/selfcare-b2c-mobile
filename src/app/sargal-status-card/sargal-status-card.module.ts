import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SargalStatusCardPage } from './sargal-status-card.page';
import { SharedModule } from 'src/shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: SargalStatusCardPage
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
  declarations: [SargalStatusCardPage]
})
export class SargalStatusCardPageModule {}
