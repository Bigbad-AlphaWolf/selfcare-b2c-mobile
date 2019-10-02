import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SargalPage } from './sargal.page';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: SargalPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		RouterModule.forChild(routes),
		SharedModule
	],
	declarations: [SargalPage]
})
export class SargalPageModule {}
