import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IlliflexConfigurationPage } from './illiflex-configuration.page';

const routes: Routes = [
  {
    path: '',
    component: IlliflexConfigurationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [IlliflexConfigurationPage]
})
export class IlliflexConfigurationPageModule {}
