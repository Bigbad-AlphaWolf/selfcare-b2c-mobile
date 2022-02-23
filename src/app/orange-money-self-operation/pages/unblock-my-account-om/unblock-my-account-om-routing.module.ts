import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {OPERATION_RESET_PIN_OM, OPERATION_UNBLOCK_OM_ACCOUNT} from 'src/shared';

import {UnblockMyAccountOmPage} from './unblock-my-account-om.page';

const routes: Routes = [
  {
    path: '',
    component: UnblockMyAccountOmPage,
    data: {
      type: OPERATION_UNBLOCK_OM_ACCOUNT
    }
  },
  {
    path: 'reset-pin',
    component: UnblockMyAccountOmPage,
    data: {
      type: OPERATION_RESET_PIN_OM
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnblockMyAccountOmPageRoutingModule {}
