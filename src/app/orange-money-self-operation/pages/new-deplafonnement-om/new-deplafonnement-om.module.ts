import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewDeplafonnementOmPage } from './new-deplafonnement-om.page';
import { MatInputModule, MatProgressSpinnerModule, MatRadioModule } from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from '../../../components/components.module';

const routes: Routes = [
	{
		path: '',
		component: NewDeplafonnementOmPage,
	},
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
		MatInputModule,
		MatRadioModule,
		SharedModule,
		ComponentsModule,
		RouterModule.forChild(routes),
	],
	declarations: [NewDeplafonnementOmPage],
})
export class NewDeplafonnementOmPageModule {}
