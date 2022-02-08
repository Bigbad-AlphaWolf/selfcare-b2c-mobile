import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UnblockMyAccountOmPage } from './unblock-my-account-om.page';

const routes: Routes = [
  {
    path: '',
    component: UnblockMyAccountOmPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnblockMyAccountOmPageRoutingModule {}
