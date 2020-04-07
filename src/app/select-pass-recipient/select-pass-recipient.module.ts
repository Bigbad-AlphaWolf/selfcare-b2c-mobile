import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectPassRecipientPage } from './select-pass-recipient.page';

const routes: Routes = [
  {
    path: '',
    component: SelectPassRecipientPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectPassRecipientPage]
})
export class SelectPassRecipientPageModule {}
