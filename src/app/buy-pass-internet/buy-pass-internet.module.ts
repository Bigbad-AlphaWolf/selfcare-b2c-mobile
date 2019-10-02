import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuyPassInternetPage } from './buy-pass-internet.page';
import { SharedModule } from 'src/shared/shared.module';
import { ListPassInternetComponent } from './list-pass-internet/list-pass-internet.component';

const routes: Routes = [
  {
    path: '',
    component: BuyPassInternetPage
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
  declarations: [BuyPassInternetPage, ListPassInternetComponent]
})
export class BuyPassInternetPageModule {}
