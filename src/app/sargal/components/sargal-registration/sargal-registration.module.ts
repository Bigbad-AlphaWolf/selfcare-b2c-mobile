import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SargalRegistrationPage } from './sargal-registration.page';
import { SharedModule } from 'src/shared/shared.module';

const routes: Routes = [
	{
		path: '',
		component: SargalRegistrationPage
	}
];

@NgModule({
	imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes), SharedModule],
	declarations: [SargalRegistrationPage]
})
export class SargalRegistrationPageModule {}
