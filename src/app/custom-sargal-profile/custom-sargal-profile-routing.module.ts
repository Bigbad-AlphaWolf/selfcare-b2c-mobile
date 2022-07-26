import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomSargalProfilePage } from './custom-sargal-profile.page';

const routes: Routes = [
  {
    path: '',
    component: CustomSargalProfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomSargalProfilePageRoutingModule {}
