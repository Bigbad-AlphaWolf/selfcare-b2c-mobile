import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateRequestOrTroubleTicketPage } from './create-request-or-trouble-ticket.page';

const routes: Routes = [
  {
    path: '',
    component: CreateRequestOrTroubleTicketPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRequestOrTroubleTicketPageRoutingModule {}
