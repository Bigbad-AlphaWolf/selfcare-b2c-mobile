import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransfertOmHubServicesPage } from './transfert-om-hub-services.page';
import { SelectBeneficiaryPopUpComponent } from './components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { MatFormFieldModule } from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TransfertOmHubServicesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [TransfertOmHubServicesPage, SelectBeneficiaryPopUpComponent],
  entryComponents: [SelectBeneficiaryPopUpComponent]
})
export class TransfertOmHubServicesPageModule {}
