import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NewPrepaidHybridDashboardPageRoutingModule} from './new-prepaid-hybrid-dashboard-routing.module';

import {NewPrepaidHybridDashboardPage} from './new-prepaid-hybrid-dashboard.page';
import {DashboardHomeComponent} from './components/dashboard-home/dashboard-home.component';
import {SharedModule} from 'src/shared/shared.module';
import {ComponentsModule} from '../components/components.module';
import {NewSuiviConsoPageModule} from '../new-suivi-conso/new-suivi-conso.module';
import {NewServicesPageModule} from '../new-services/new-services.module';
import {NewAssistanceHubV2PageModule} from '../new-assistance-hub-v2/new-assistance-hub-v2.module';
import {SwiperModule} from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewPrepaidHybridDashboardPageRoutingModule,
    SharedModule,
    ComponentsModule,
    NewSuiviConsoPageModule,
    NewServicesPageModule,
    NewAssistanceHubV2PageModule,
    SwiperModule
  ],
  declarations: [NewPrepaidHybridDashboardPage, DashboardHomeComponent]
})
export class NewPrepaidHybridDashboardPageModule {}
