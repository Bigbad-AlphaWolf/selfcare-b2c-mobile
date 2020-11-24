import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SelectIlliflexTypePage } from './select-illiflex-type.page';

const routes: Routes = [
  {
    path: '',
    component: SelectIlliflexTypePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SelectIlliflexTypePage]
})
export class SelectIlliflexTypePageModule {}
