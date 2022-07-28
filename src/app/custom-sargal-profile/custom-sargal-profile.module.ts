import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomSargalProfilePageRoutingModule } from './custom-sargal-profile-routing.module';

import { CustomSargalProfilePage } from './custom-sargal-profile.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { CustomSargalCardComponent } from './sargal-components/custom-sargal-card/custom-sargal-card.component';
import { SargalReductionCardComponent } from './sargal-components/sargal-reduction-card/sargal-reduction-card.component';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ComponentsModule,
    IonicImageLoader,
    IonicModule,
    CustomSargalProfilePageRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CustomSargalProfilePage, CustomSargalCardComponent, SargalReductionCardComponent]
})
export class CustomSargalProfilePageModule {}
