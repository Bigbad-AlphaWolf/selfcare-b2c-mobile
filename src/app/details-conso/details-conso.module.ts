import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsConsoPage } from './details-conso.page';
import { HistoriqueConsoComponent } from './historique-conso/historique-conso.component';
import { SuiviConsoComponent } from './suivi-conso/suivi-conso.component';
import { SharedModule } from 'src/shared/shared.module';
import { HistoriqueAchatComponent } from './historique-achat/historique-achat.component';
import { PipesModule } from '../pipes/pipes.module';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: DetailsConsoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    PipesModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailsConsoPage, HistoriqueConsoComponent, SuiviConsoComponent, HistoriqueAchatComponent]
})
export class DetailsConsoPageModule {}
