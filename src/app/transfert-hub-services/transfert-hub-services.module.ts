import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransfertHubServicesPage } from './transfert-hub-services.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: TransfertHubServicesPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [TransfertHubServicesPage],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TransfertHubServicesPageModule {}
