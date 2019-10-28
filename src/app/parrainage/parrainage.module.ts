import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ParrainagePage } from './parrainage.page';
import { SharedModule } from 'src/shared/shared.module';
import { CreateSponsorFormComponent } from './create-sponsor-form/create-sponsor-form.component';

const routes: Routes = [
  {
    path: '',
    component: ParrainagePage
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
  declarations: [ParrainagePage, CreateSponsorFormComponent],
  entryComponents: [CreateSponsorFormComponent]
})
export class ParrainagePageModule {}
