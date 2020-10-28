import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DalalTonesPage } from './dalal-tones.page';
import { SharedModule } from 'src/shared/shared.module';
import { DalalActivationSuccessModalComponent } from './components/dalal-activation-success-modal/dalal-activation-success-modal.component';
import { DalalMoreInfosComponent } from './components/dalal-more-infos/dalal-more-infos.component';
import { DalalDisablePopupComponent } from './components/dalal-disable-popup/dalal-disable-popup.component';
import { ActivatedDalalPageComponent } from './components/activated-dalal-page/activated-dalal-page.component';
import { DalalActivationComponent } from './components/dalal-activation/dalal-activation.component';

const routes: Routes = [
  {
    path: '',
    component: DalalTonesPage,
  },
  {
    path: 'activated-dalal',
    component: ActivatedDalalPageComponent,
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
    DalalActivationSuccessModalComponent,
    DalalMoreInfosComponent,
    DalalDisablePopupComponent,
    ActivatedDalalPageComponent,
    DalalActivationComponent,
  ],
  entryComponents: [
    DalalActivationSuccessModalComponent,
    DalalMoreInfosComponent,
    DalalDisablePopupComponent,
  ],
})
export class DalalTonesPageModule {}
