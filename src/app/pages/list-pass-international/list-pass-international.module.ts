import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPassInternationalPageRoutingModule } from './list-pass-international-routing.module';

import { ListPassInternationalPage } from './list-pass-international.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    ListPassInternationalPageRoutingModule,
  ],
  declarations: [ListPassInternationalPage],
})
export class ListPassInternationalPageModule {}
