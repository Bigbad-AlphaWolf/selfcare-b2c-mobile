import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OmUniverseComponent } from './om-universe.component';

const routes: Routes = [
  {
    path: '',
    component: OmUniverseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OmUniverseRoutingModule { }
