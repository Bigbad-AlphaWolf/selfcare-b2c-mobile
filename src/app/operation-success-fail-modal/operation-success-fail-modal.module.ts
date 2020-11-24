import {
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OperationSuccessFailModalPage } from './operation-success-fail-modal.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: OperationSuccessFailModalPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [OperationSuccessFailModalPage],
  exports: [OperationSuccessFailModalPage],
  entryComponents: [OperationSuccessFailModalPage],
  schemas: [],
})
export class OperationSuccessFailModalPageModule {}
