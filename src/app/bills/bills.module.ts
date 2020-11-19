import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BillsPage } from './bills.page';
import { SharedModule } from 'src/shared/shared.module';
import { BillsDetailsMobileComponent } from './bills-details-mobile/bills-details-mobile.component';

import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { PipesModule } from '../pipes/pipes.module';
const routes: Routes = [
  {
    path: '',
    component: BillsPage
  }
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    File,
    FileOpener
  ],
  declarations: [BillsPage, BillsDetailsMobileComponent]
})
export class BillsPageModule {}
