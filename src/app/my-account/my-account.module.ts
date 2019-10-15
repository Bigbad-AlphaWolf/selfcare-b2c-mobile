import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyAccountPage } from './my-account.page';
import { SharedModule } from 'src/shared/shared.module';
import { MyAccountRoutingModule } from './my-account-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    MyAccountRoutingModule
  ],
  declarations: [MyAccountPage]
})
export class MyAccountPageModule {}
