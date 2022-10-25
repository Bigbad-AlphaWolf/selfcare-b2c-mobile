import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewSuiviConsoPageRoutingModule } from './new-suivi-conso-routing.module';

import { NewSuiviConsoPage } from './new-suivi-conso.page';
import { SharedModule } from 'src/shared/shared.module';
import { CommunicationHistoricComponent } from './pages/communication-historic/communication-historic.component';
import { NewDetailsConsoComponent } from './pages/new-details-conso/new-details-conso.component';
import { TransactionsHistoricComponent } from './pages/transactions-historic/transactions-historic.component';
import { InternetHistoricComponent } from './pages/internet-historic/internet-historic.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewSuiviConsoPageRoutingModule,
  ],
  declarations: [
    NewSuiviConsoPage,
    CommunicationHistoricComponent,
    NewDetailsConsoComponent,
    TransactionsHistoricComponent,
    InternetHistoricComponent,
  ],
  exports: [NewSuiviConsoPage],
})
export class NewSuiviConsoPageModule {}
