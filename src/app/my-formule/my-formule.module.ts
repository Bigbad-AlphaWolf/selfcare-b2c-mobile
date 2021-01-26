import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyFormulePage } from './my-formule.page';
import { SeeDetailsFormuleComponent } from './see-details-formule/see-details-formule.component';
import { SharedModule } from 'src/shared/shared.module';
import { ChangeOfferPopupComponent } from './change-offer-popup/change-offer-popup.component';
import { ChangeFormuleSuccessModalComponent } from './change-formule-success-modal/change-formule-success-modal.component';

const routes: Routes = [
  {
    path: '',
    component: MyFormulePage,
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
    MyFormulePage,
    SeeDetailsFormuleComponent,
    ChangeOfferPopupComponent,
    ChangeFormuleSuccessModalComponent,
  ],
  entryComponents: [
    ChangeOfferPopupComponent,
    ChangeFormuleSuccessModalComponent,
  ],
})
export class MyFormulePageModule {}
