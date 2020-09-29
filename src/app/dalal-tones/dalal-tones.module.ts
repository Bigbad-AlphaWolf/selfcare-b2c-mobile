import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DalalTonesPage } from './dalal-tones.page';
import { SharedModule } from 'src/shared/shared.module';
import { DalalActivationComponent } from './components/dalal-activation/dalal-activation.component';
import { DalalActivationSuccessModalComponent } from './components/dalal-activation-success-modal/dalal-activation-success-modal.component';

const routes: Routes = [
  {
    path: '',
    component: DalalTonesPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    DalalTonesPage,
    DalalActivationComponent,
    DalalActivationSuccessModalComponent,
  ],
  entryComponents: [
    DalalActivationComponent,
    DalalActivationSuccessModalComponent,
  ],
})
export class DalalTonesPageModule {}
