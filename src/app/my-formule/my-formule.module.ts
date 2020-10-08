import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MyFormulePage } from './my-formule.page';
import { SeeDetailsFormuleComponent } from './see-details-formule/see-details-formule.component';
import { SharedModule } from 'src/shared/shared.module';
import { ChangeOfferPopupComponent } from './change-offer-popup/change-offer-popup.component';

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
  ],
  entryComponents: [ChangeOfferPopupComponent],
})
export class MyFormulePageModule {}
