import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FixesServicesPage } from './fixes-services.page';

const routes: Routes = [
  {
    path: '',
    component: FixesServicesPage
  },
  {
    path: 'details-offres-fixe',
    loadChildren: () => import('./pages/details-offres-fixe/details-offres-fixe.module').then( m => m.DetailsOffresFixePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FixesServicesPageRoutingModule {}
