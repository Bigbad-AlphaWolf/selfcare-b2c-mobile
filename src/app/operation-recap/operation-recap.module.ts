import {
  NgModule,
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OperationRecapPage } from './operation-recap.page';
import { SharedModule } from 'src/shared/shared.module';
import { ComponentsModule } from '../components/components.module';
import { PipesModule } from '../pipes/pipes.module';
import { SetRecipientNamesModalComponent } from './set-recipient-names-modal/set-recipient-names-modal.component';

const routes: Routes = [
  {
    path: '',
    component: OperationRecapPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ComponentsModule,
    PipesModule,
    RouterModule.forChild(routes),
  ],
  declarations: [OperationRecapPage, SetRecipientNamesModalComponent],
  entryComponents: [SetRecipientNamesModalComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class OperationRecapPageModule {}
