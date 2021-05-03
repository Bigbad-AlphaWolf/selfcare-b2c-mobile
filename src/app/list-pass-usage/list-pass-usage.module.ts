import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListPassUsagePage } from './list-pass-usage.page';
import { PassUsageItemComponent } from './components/pass-usage-item/pass-usage-item.component';
import { IonicImageLoader } from 'ionic-image-loader';
import { MatProgressSpinnerModule } from '@angular/material';

const routes: Routes = [
  {
    path: '',
    component: ListPassUsagePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicImageLoader,
    MatProgressSpinnerModule,
  ],
  declarations: [ListPassUsagePage, PassUsageItemComponent],
})
export class ListPassUsagePageModule {}
