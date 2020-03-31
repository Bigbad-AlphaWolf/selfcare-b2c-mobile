import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsConsoPage } from './details-conso.page';
import { HistoriqueConsoComponent } from './historique-conso/historique-conso.component';
import { SuiviConsoComponent } from './suivi-conso/suivi-conso.component';
import { MatIconModule, MatButtonModule, MatTabsModule } from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { HistoriqueAchatComponent } from './historique-achat/historique-achat.component';
import { ItemHistorikDetailsInfosComponent } from './components/item-historik-details-infos/item-historik-details-infos.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsConsoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailsConsoPage, HistoriqueConsoComponent, SuiviConsoComponent, HistoriqueAchatComponent, ItemHistorikDetailsInfosComponent]
})
export class DetailsConsoPageModule {}
