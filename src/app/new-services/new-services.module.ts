import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewServicesPageRoutingModule } from './new-services-routing.module';

import { NewServicesPage } from './new-services.page';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewServicesPageRoutingModule,
  ],
  declarations: [NewServicesPage],
  exports: [NewServicesPage],
})
export class NewServicesPageModule {}
