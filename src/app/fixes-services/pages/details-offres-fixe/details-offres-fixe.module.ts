import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsOffresFixePageRoutingModule } from './details-offres-fixe-routing.module';

import { DetailsOffresFixePage } from './details-offres-fixe.page';
import { IonicImageLoader } from 'ionic-image-loader';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
		IonicImageLoader,
		SharedModule,
    DetailsOffresFixePageRoutingModule
  ],
  declarations: [DetailsOffresFixePage]
})
export class DetailsOffresFixePageModule {}
