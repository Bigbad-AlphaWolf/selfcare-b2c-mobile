import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSelectBeneficiaryPage } from './new-select-beneficiary.page';

const routes: Routes = [
  {
    path: '',
    component: NewSelectBeneficiaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSelectBeneficiaryPageRoutingModule {}
