import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {UnblockMyAccountOmPageRoutingModule} from './unblock-my-account-om-routing.module';

import {UnblockMyAccountOmPage} from './unblock-my-account-om.page';
import {SharedModule} from 'src/shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, UnblockMyAccountOmPageRoutingModule],
  declarations: [UnblockMyAccountOmPage]
})
export class UnblockMyAccountOmPageModule {}
