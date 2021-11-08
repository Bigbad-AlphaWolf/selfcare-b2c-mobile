import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ListPassUsagePage} from './list-pass-usage.page';
import {IonicImageLoader} from 'ionic-image-loader';
import {SharedModule} from 'src/shared/shared.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

const routes: Routes = [
  {
    path: '',
    component: ListPassUsagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicImageLoader,
    MatProgressSpinnerModule,
    SharedModule
  ],
  declarations: [ListPassUsagePage]
})
export class ListPassUsagePageModule {}
