import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ClipboardModule } from 'ngx-clipboard';

import { EmergenciesPage } from './emergencies.page';
import { ChangeSeddoCodeComponent } from './change-seddo-code/change-seddo-code.component';
import { GetPukCodeComponent } from './get-puk-code/get-puk-code.component';
import { HelpItemComponent } from './help-item/help-item.component';
import { NumeroSeriePopupComponent } from './numero-serie-popup/numero-serie-popup.component';
import { OrangeMoneyComponent } from './orange-money/orange-money.component';
import { ParametrageInternetComponent } from './parametrage-internet/parametrage-internet.component';
import { RechargeCardNumberComponent } from './recharge-card-number/recharge-card-number.component';
import { SharedModule } from 'src/shared/shared.module';
import { EmergenciesRoutingModule } from './emergencies-routing.module';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

const routes: Routes = [
  {
    path: '',
    component: EmergenciesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ClipboardModule,
    EmergenciesRoutingModule
  ],
  declarations: [
    EmergenciesPage,
    ChangeSeddoCodeComponent,
    GetPukCodeComponent,
    HelpItemComponent,
    NumeroSeriePopupComponent,
    OrangeMoneyComponent,
    ParametrageInternetComponent,
    RechargeCardNumberComponent
  ],
  entryComponents: [NumeroSeriePopupComponent],
  providers: [FileTransfer, File, FileOpener]
})
export class EmergenciesPageModule {}
