import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { DashboardPrepaidHybridComponent } from './dashboard-prepaid-hybrid/dashboard-prepaid-hybrid.component';
import { DashboardPostpaidComponent } from './dashboard-postpaid/dashboard-postpaid.component';
import { DashboardKireneComponent } from './dashboard-kirene/dashboard-kirene.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { DashboardHomePrepaidComponent } from './dashboard-home-prepaid/dashboard-home-prepaid.component';
import { DashboardPostpaidFixeComponent } from './dashboard-postpaid-fixe/dashboard-postpaid-fixe.component';

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
  declarations: [
    DashboardPage,
    DashboardPrepaidHybridComponent,
    DashboardPostpaidComponent,
    DashboardPostpaidFixeComponent,
    DashboardKireneComponent,
    DashboardHomePrepaidComponent
  ]
})
export class DashboardPageModule {}
