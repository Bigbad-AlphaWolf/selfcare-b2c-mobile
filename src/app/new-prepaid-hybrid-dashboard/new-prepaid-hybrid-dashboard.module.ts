import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {NewPrepaidHybridDashboardPageRoutingModule} from './new-prepaid-hybrid-dashboard-routing.module';

import {NewPrepaidHybridDashboardPage} from './new-prepaid-hybrid-dashboard.page';
import {DashboardHomeComponent} from './components/dashboard-home/dashboard-home.component';
import {SharedModule} from 'src/shared/shared.module';
import {ScrollVanishDirective} from '../directives/scroll-vanish/scroll-vanish.directive';
import {ComponentsModule} from '../components/components.module';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, NewPrepaidHybridDashboardPageRoutingModule, SharedModule, ComponentsModule],
  declarations: [NewPrepaidHybridDashboardPage, DashboardHomeComponent]
})
export class NewPrepaidHybridDashboardPageModule {}
