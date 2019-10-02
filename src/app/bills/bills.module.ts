import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BillsPage } from './bills.page';
import { SharedModule } from 'src/shared/shared.module';
import { BillsDetailsMobileComponent } from './bills-details-mobile/bills-details-mobile.component';

const routes: Routes = [
  {
    path: '',
    component: BillsPage
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
  declarations: [BillsPage, BillsDetailsMobileComponent]
})
export class BillsPageModule {}
