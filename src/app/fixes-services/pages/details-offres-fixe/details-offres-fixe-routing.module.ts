import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsOffresFixePage } from './details-offres-fixe.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsOffresFixePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsOffresFixePageRoutingModule {}
