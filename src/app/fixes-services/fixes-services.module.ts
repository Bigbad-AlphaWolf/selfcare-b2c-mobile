import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FixesServicesPageRoutingModule } from './fixes-services-routing.module';

import { FixesServicesPage } from './fixes-services.page';
import { SharedModule } from 'src/shared/shared.module';
import { IonicImageLoader } from 'ionic-image-loader';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
		ComponentsModule,
		SharedModule,
		IonicImageLoader,
    FixesServicesPageRoutingModule
  ],
  declarations: [FixesServicesPage]
})
export class FixesServicesPageModule {}
