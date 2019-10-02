import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/auth-guard/auth.guard';
import { EmergenciesPage } from './emergencies.page';
import { GetPukCodeComponent } from './get-puk-code/get-puk-code.component';
import { ParametrageInternetComponent } from './parametrage-internet/parametrage-internet.component';
import { ChangeSeddoCodeComponent } from './change-seddo-code/change-seddo-code.component';
import { RechargeCardNumberComponent } from './recharge-card-number/recharge-card-number.component';
import { OrangeMoneyComponent } from './orange-money/orange-money.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: EmergenciesPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'puk',
    component: GetPukCodeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'internet-mobile',
    component: ParametrageInternetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-seddo-code',
    component: ChangeSeddoCodeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'carte-recharge',
    component: RechargeCardNumberComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'operation-om/:type',
    component: OrangeMoneyComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergenciesRoutingModule {}
