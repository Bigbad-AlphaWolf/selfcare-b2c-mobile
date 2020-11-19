import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RattachedPhonesNumberPage } from './rattached-phones-number.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { RattachNumberModalComponent } from 'src/app/components/rattach-number-modal/rattach-number-modal.component';

const routes: Routes = [
  {
    path: '',
    component: RattachedPhonesNumberPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents:[RattachNumberModalComponent],
  declarations: [RattachedPhonesNumberPage]
})
export class RattachedPhonesNumberPageModule {}
