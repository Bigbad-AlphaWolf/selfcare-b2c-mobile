import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RegistrationSuccessModalPage } from './registration-success-modal.page';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: RegistrationSuccessModalPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [RegistrationSuccessModalPage],
  entryComponents: [RegistrationSuccessModalPage],
  exports: [RegistrationSuccessModalPage],
})
export class RegistrationSuccessModalPageModule {}
