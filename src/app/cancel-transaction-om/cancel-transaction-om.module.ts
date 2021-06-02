import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CancelTransactionOmPage } from './cancel-transaction-om.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: CancelTransactionOmPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CancelTransactionOmPage]
})
export class CancelTransactionOmPageModule {}
