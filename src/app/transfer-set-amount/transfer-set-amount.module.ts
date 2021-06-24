import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from '../pipes/pipes.module';
import { IonicModule } from '@ionic/angular';

import { TransferSetAmountPage } from './transfer-set-amount.page';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: TransferSetAmountPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatFormFieldModule,
    MatInputModule,
    PipesModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TransferSetAmountPage],
})
export class TransferSetAmountPageModule {}
