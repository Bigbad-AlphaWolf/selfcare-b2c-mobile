import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewSuiviConsoPage } from './new-suivi-conso.page';

const routes: Routes = [
  {
    path: '',
    component: NewSuiviConsoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewSuiviConsoPageRoutingModule {}
