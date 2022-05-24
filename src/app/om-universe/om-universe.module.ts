import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OmUniverseRoutingModule } from './om-universe-routing.module';
import { OmUniverseComponent } from './om-universe.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/shared/shared.module';


@NgModule({
  declarations: [OmUniverseComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    OmUniverseRoutingModule,
    SharedModule
  ],
  exports: [
    OmUniverseComponent
  ]
})
export class OmUniverseModule { }
