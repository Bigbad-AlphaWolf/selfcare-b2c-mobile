import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPage } from './my-account.page';
import { SharedModule } from 'src/shared/shared.module';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { ChangeAvatarPopupComponent } from './change-avatar-popup/change-avatar-popup.component';
import { InProgressPopupComponent } from 'src/shared/in-progress-popup/in-progress-popup.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MyAccountRoutingModule
  ],
  entryComponents: [ChangeAvatarPopupComponent, InProgressPopupComponent],
  declarations: [MyAccountPage, ChangeAvatarPopupComponent, InProgressPopupComponent]
})
export class MyAccountPageModule {}
