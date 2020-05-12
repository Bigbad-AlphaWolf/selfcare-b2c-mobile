import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransfertOmRecapitulatifPage } from './transfert-om-recapitulatif.page';

const routes: Routes = [
  {
    path: '',
    component: TransfertOmRecapitulatifPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransfertOmRecapitulatifPage]
})
export class TransfertOmRecapitulatifPageModule {}
