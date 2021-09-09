import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewAssistanceHubV2PageRoutingModule } from './new-assistance-hub-v2-routing.module';

import { NewAssistanceHubV2Page } from './new-assistance-hub-v2.page';
import { SharedModule } from 'src/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    NewAssistanceHubV2PageRoutingModule,
  ],
  declarations: [NewAssistanceHubV2Page],
})
export class NewAssistanceHubV2PageModule {}
