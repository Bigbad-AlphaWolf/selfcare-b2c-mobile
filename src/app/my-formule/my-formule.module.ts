import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyFormulePage } from './my-formule.page';
import { SeeDetailsFormuleComponent } from './see-details-formule/see-details-formule.component';
import { SharedModule } from 'src/shared/shared.module';
import { MatInputModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: MyFormulePage
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
  declarations: [MyFormulePage, SeeDetailsFormuleComponent]
})
export class MyFormulePageModule {}
