import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewPinpadModalPage } from './new-pinpad-modal.page';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: NewPinpadModalPage,
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
  declarations: [NewPinpadModalPage],
  entryComponents: [NewPinpadModalPage],
  exports: [NewPinpadModalPage],
})
export class NewPinpadModalPageModule {}
