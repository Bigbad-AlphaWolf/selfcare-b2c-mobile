import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuyPassIllimixPage } from './buy-pass-illimix.page';
import { IllimixListComponent } from './illimix-list/illimix-list.component';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: BuyPassIllimixPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuyPassIllimixPage, IllimixListComponent]
})
export class BuyPassIllimixPageModule {}
