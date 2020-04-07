import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPassInternetV3Page } from './list-pass-internet-v3.page';
import { SharedModule } from 'src/shared/shared.module';
import { ItemPassInternetComponent } from './component/item-pass-internet/item-pass-internet.component';

const routes: Routes = [
  {
    path: '',
    component: ListPassInternetV3Page
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
  declarations: [ListPassInternetV3Page, ItemPassInternetComponent]
})
export class ListPassInternetV3PageModule {}
