import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OperationSuccessFailModalPage } from './operation-success-fail-modal.page';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: OperationSuccessFailModalPage,
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
  declarations: [OperationSuccessFailModalPage],
  exports: [OperationSuccessFailModalPage],
  entryComponents: [OperationSuccessFailModalPage],
})
export class OperationSuccessFailModalPageModule {}
