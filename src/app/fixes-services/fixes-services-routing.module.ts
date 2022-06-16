import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FixesServicesPage } from './fixes-services.page';

const routes: Routes = [
  {
    path: '',
    component: FixesServicesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FixesServicesPageRoutingModule {}
