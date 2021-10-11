import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../services/auth-guard/auth.guard';
import { MyAccountPage } from './my-account.page';

const routes: Routes = [
  {
    path: '',
    component: MyAccountPage,
    canActivate: [AuthGuard]
  },
  {
    path: 'change-password',
    loadChildren:
      () => import('./change-password/change-password.module').then(m => m.ChangePasswordPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'delete-number',
    loadChildren:
      () => import('./delete-linked-numbers/delete-linked-numbers.module').then(m => m.DeleteLinkedNumbersPageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {}
