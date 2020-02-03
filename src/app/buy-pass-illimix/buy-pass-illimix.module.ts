import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuyPassIllimixPage } from './buy-pass-illimix.page';
import { SharedModule } from 'src/shared/shared.module';
import { IllimixListV2Component } from './illimix-list-v2/illimix-list-v2.component';

const routes: Routes = [
  {
    path: '',
    component: BuyPassIllimixPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, RouterModule.forChild(routes)],
  declarations: [BuyPassIllimixPage, IllimixListV2Component]
})
export class BuyPassIllimixPageModule {}
