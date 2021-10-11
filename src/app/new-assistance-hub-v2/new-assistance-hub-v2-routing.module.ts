import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewAssistanceHubV2Page } from './new-assistance-hub-v2.page';

const routes: Routes = [
  {
    path: '',
    component: NewAssistanceHubV2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewAssistanceHubV2PageRoutingModule {}
