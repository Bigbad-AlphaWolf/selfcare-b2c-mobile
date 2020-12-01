import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPassVoyagePage } from './list-pass-voyage.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: ListPassVoyagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListPassVoyagePage]
})
export class ListPassVoyagePageModule {}
