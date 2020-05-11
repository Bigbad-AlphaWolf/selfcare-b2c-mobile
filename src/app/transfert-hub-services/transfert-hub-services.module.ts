import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransfertHubServicesPage } from './transfert-hub-services.page';

const routes: Routes = [
  {
    path: '',
    component: TransfertHubServicesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransfertHubServicesPage]
})
export class TransfertHubServicesPageModule {}
