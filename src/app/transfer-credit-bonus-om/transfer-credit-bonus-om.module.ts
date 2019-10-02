import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransferCreditBonusOmPage } from './transfer-credit-bonus-om.page';
import { ChooseTransferTypeComponent } from './choose-transfer-type/choose-transfer-type.component';
import { TransferRecipientAmountComponent } from './transfer-recipient-amount/transfer-recipient-amount.component';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TransferCreditBonusOmPage
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
  declarations: [
    TransferCreditBonusOmPage,
    ChooseTransferTypeComponent,
    TransferRecipientAmountComponent
  ]
})
export class TransferCreditBonusOmPageModule {}
