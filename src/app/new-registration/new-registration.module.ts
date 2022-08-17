import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {NewRegistrationPage} from './new-registration.page';
import {SharedModule} from 'src/shared/shared.module';
import {OpenNativeSettings} from '@ionic-native/open-native-settings/ngx';
import {MsisdnAssistanceModalComponent} from './components/msisdn-assistance-modal/msisdn-assistance-modal.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {TypePhoneNumberManuallyComponent} from './components/type-phone-number-manually/type-phone-number-manually.component';

const routes: Routes = [
  {
    path: '',
    component: NewRegistrationPage
  }
];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, SharedModule, MatBottomSheetModule, RouterModule.forChild(routes)],
  declarations: [NewRegistrationPage, MsisdnAssistanceModalComponent, TypePhoneNumberManuallyComponent],
  entryComponents: [MsisdnAssistanceModalComponent],
  providers: [OpenNativeSettings]
})
export class NewRegistrationPageModule {}
