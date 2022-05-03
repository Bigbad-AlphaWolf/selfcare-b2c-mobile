import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NewSelectBeneficiaryPageRoutingModule} from './new-select-beneficiary-routing.module';

import {NewSelectBeneficiaryPage} from './new-select-beneficiary.page';
import {SharedModule} from 'src/shared/shared.module';
import {RecipientItemContactComponent} from './components/recipient-item-contact/recipient-item-contact.component';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewSelectBeneficiaryPageRoutingModule,
    ScrollingModule
  ],
  declarations: [NewSelectBeneficiaryPage, RecipientItemContactComponent]
})
export class NewSelectBeneficiaryPageModule {}
