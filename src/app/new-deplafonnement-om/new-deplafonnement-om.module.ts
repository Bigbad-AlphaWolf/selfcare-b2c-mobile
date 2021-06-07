import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewDeplafonnementOmPage } from './new-deplafonnement-om.page';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { TakePictureComponent } from '../components/take-picture/take-picture.component';
import {
  MatInputModule,
  MatProgressSpinnerModule,
  MatRadioModule,
} from '@angular/material';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOtpModalComponent } from './components/type-otp-modal/type-otp-modal.component';
import { ItemOmUserStatusCardInfosComponent } from './components/item-om-user-status-card-infos/item-om-user-status-card-infos.component';
import { ComponentsModule } from '../components/components.module';

const routes: Routes = [
  {
    path: '',
    component: NewDeplafonnementOmPage,
  },
  {
    path: 'take-picture',
    component: TakePictureComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatRadioModule,
    SharedModule,
    ComponentsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    NewDeplafonnementOmPage,
    TypeOtpModalComponent,
    ItemOmUserStatusCardInfosComponent
  ],
  providers: [CameraPreview],
  entryComponents: [TypeOtpModalComponent],
})
export class NewDeplafonnementOmPageModule {}
