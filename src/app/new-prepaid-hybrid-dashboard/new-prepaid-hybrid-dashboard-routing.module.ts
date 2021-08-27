import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth-guard/auth.guard';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';

import { NewPrepaidHybridDashboardPage } from './new-prepaid-hybrid-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: NewPrepaidHybridDashboardPage,
    children: [
      {
        path: 'dashboard-home',
        component: DashboardHomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'suivi-conso',
        loadChildren: () =>
          import('../new-suivi-conso/new-suivi-conso.module').then(
            (m) => m.NewSuiviConsoPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-services',
        loadChildren: () =>
          import('../new-services/new-services.module').then(
            (m) => m.NewServicesPageModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'assistance',
        loadChildren: () =>
          import('../new-assistance-hub-v2/new-assistance-hub-v2.module').then(
            (m) => m.NewAssistanceHubV2PageModule
          ),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPrepaidHybridDashboardPageRoutingModule {}
