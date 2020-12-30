import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReclamationOmTransactionPage } from './reclamation-om-transaction.page';
import { SharedModule } from 'src/shared/shared.module';
import { HistorikTransactionByTypeModalComponent } from './components/historik-transaction-by-type-modal/historik-transaction-by-type-modal.component';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ReclamationOmTransactionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReclamationOmTransactionPage, HistorikTransactionByTypeModalComponent],
  entryComponents: [HistorikTransactionByTypeModalComponent]
})
export class ReclamationOmTransactionPageModule {}
