import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FollowUpRequestsPage } from './follow-up-requests.page';
import { SharedModule } from 'src/shared/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: FollowUpRequestsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    PipesModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FollowUpRequestsPage]
})
export class FollowUpRequestsPageModule {}
