import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DeleteLinkedNumbersPage } from './delete-linked-numbers.page';
import { MyAccountPageModule } from '../my-account.module';
import { NumbersToDeleteListComponent } from './numbers-to-delete-list/numbers-to-delete-list.component';
import { SharedModule } from 'src/shared/shared.module';
import { PhonenumberItemModule } from 'src/shared/phonenumber-item/phonenumber-item.module';

const routes: Routes = [
	{
		path: '',
		component: DeleteLinkedNumbersPage
	}
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		MyAccountPageModule,
		RouterModule.forChild(routes),
		PhonenumberItemModule
	],
	declarations: [DeleteLinkedNumbersPage, NumbersToDeleteListComponent]
})
export class DeleteLinkedNumbersPageModule {}
