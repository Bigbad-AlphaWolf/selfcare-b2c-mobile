import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateRequestOrTroubleTicketPageRoutingModule } from './create-request-or-trouble-ticket-routing.module';

import { CreateRequestOrTroubleTicketPage } from './create-request-or-trouble-ticket.page';
import { SharedModule } from 'src/shared/shared.module';
import { MyFixeNumbersComponent } from './component/my-fixe-numbers/my-fixe-numbers.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, CreateRequestOrTroubleTicketPageRoutingModule],
  declarations: [CreateRequestOrTroubleTicketPage, MyFixeNumbersComponent],
})
export class CreateRequestOrTroubleTicketPageModule {}
