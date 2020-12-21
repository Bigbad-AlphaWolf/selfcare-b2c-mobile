import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactIbouHubPage } from './contact-ibou-hub.page';

const routes: Routes = [
  {
    path: '',
    component: ContactIbouHubPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ContactIbouHubPage]
})
export class ContactIbouHubPageModule {}
