import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HomeV2Page } from './home-v2.page';
import { MatBottomSheetModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: HomeV2Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatBottomSheetModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomeV2Page]
})
export class HomeV2PageModule {}
