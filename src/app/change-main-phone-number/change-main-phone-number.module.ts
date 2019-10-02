import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChangeMainPhoneNumberPage } from './change-main-phone-number.page';
import { SharedModule } from 'src/shared/shared.module';
import { PhoneNumbersListComponent } from './phone-numbers-list/phone-numbers-list.component';

const routes: Routes = [
	{
		path: '',
		component: ChangeMainPhoneNumberPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SharedModule,
		RouterModule.forChild(routes)
	],
	declarations: [ChangeMainPhoneNumberPage, PhoneNumbersListComponent]
})
export class ChangeMainPhoneNumberPageModule {}
