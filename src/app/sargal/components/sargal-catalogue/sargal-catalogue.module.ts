import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SargalCataloguePage } from './sargal-catalogue.page';
import { SharedModule } from 'src/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
	{
		path: ':categoryGift',
		component: SargalCataloguePage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SharedModule,
		PipesModule,
		RouterModule.forChild(routes)
	],
	declarations: [SargalCataloguePage]
})
export class SargalCataloguePageModule {}
