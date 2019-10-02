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
      './change-password/change-password.module#ChangePasswordPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'delete-number',
    loadChildren:
      './delete-linked-numbers/delete-linked-numbers.module#DeleteLinkedNumbersPageModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {}
