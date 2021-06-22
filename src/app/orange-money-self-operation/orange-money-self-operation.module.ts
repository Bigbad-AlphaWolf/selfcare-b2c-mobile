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
		loadChildren: './pages/cancel-transaction-om/cancel-transaction-om.module#CancelTransactionOmPageModule',
	},
	{
		path: 'deplafonnement',
		loadChildren: './pages/new-deplafonnement-om/new-deplafonnement-om.module#NewDeplafonnementOmPageModule',
	},
	{
		path: 'open-om-account',
		loadChildren:
			'./pages/open-om-account/open-om-account.module#OpenOmAccountPageModule',
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
