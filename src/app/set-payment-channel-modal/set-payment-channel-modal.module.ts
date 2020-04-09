import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SetPaymentChannelModalPage } from './set-payment-channel-modal.page';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: SetPaymentChannelModalPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [SetPaymentChannelModalPage],
  entryComponents: [SetPaymentChannelModalPage],
  exports: [SetPaymentChannelModalPage],
})
export class SetPaymentChannelModalPageModule {}
