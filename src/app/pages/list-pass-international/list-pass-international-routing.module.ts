import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListPassInternationalPage } from './list-pass-international.page';

const routes: Routes = [
  {
    path: '',
    component: ListPassInternationalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListPassInternationalPageRoutingModule {}
