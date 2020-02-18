import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { MatProgressSpinnerModule } from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatProgressSpinnerModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
