import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakePictureComponent } from '../components/take-picture/take-picture.component';
import { RouterModule, Routes } from '@angular/router';
import { TypeOtpModalComponent } from './components/type-otp-modal/type-otp-modal.component';
import { NewDeplafonnementOmPage } from './pages/new-deplafonnement-om/new-deplafonnement-om.page';
import { CameraPreview } from '@ionic-native/camera-preview/ngx';
import { ComponentsModule } from '../components/components.module';
import { IonicModule } from '@ionic/angular';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
	{
		path: 'take-picture',
		component: TakePictureComponent,
	},
	{
		path: 'cancel-transaction',
		loadChildren: () => import('./pages/cancel-transaction-om/cancel-transaction-om.module').then(m => m.CancelTransactionOmPageModule),
	},
	{
		path: 'deplafonnement',
		loadChildren: () => import('./pages/new-deplafonnement-om/new-deplafonnement-om.module').then(m => m.NewDeplafonnementOmPageModule),
	},
	{
		path: 'open-om-account',
		loadChildren:
			() => import('./pages/open-om-account/open-om-account.module').then(m => m.OpenOmAccountPageModule),
	},
	{
		path: '**',
		redirectTo: 'open-om-account'
	},
];

@NgModule({
	declarations: [TypeOtpModalComponent],
	imports: [CommonModule, IonicModule, MaterialComponentsModule, PipesModule, ComponentsModule, RouterModule.forChild(routes)],
  providers: [CameraPreview],
  entryComponents: [TypeOtpModalComponent],
})
export class OrangeMoneySelfOperationModule {}
