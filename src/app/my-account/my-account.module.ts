import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPage } from './my-account.page';
import { ChangeAvatarPopupComponent } from './change-avatar-popup/change-avatar-popup.component';
import { DeleteNumberPopupComponent } from './delete-number-popup/delete-number-popup.component';
import { SharedModule } from 'src/shared/shared.module';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { AccountService } from '../services/account-service/account.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MyAccountRoutingModule
  ],
  declarations: [MyAccountPage, DeleteNumberPopupComponent],
  exports: [DeleteNumberPopupComponent]
})
export class MyAccountPageModule {}
