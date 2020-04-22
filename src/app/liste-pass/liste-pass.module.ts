import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListePassPage } from './liste-pass.page';
import { SharedModule } from 'src/shared/shared.module';
import { ItemPassInternetComponent } from './component/item-pass-internet/item-pass-internet.component';
import { ItemPassIllimixComponent } from './component/item-pass-illimix/item-pass-illimix.component';

const routes: Routes = [
  {
    path: '',
    component: ListePassPage
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
  declarations: [ListePassPage, ItemPassInternetComponent, ItemPassIllimixComponent]
})
export class ListePassPageModule {}
