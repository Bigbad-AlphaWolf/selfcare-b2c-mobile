import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DetailsConsoPage } from './details-conso.page';
import { HistoriqueConsoComponent } from './historique-conso/historique-conso.component';
import { SuiviConsoComponent } from './suivi-conso/suivi-conso.component';
import {
	MatIconModule,
	MatMenuModule,
	MatButtonModule
} from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';

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
		SharedModule,
		RouterModule.forChild(routes)
	],
	declarations: [
		DetailsConsoPage,
		HistoriqueConsoComponent,
		SuiviConsoComponent
	]
})
export class DetailsConsoPageModule {}
