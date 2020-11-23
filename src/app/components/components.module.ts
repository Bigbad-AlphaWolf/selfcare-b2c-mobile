import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOfferPlanComponent } from './item-offer-plan/item-offer-plan.component';
import { ItemPassIllimixComponent } from './item-pass-illimix/item-pass-illimix.component';
import { ItemPassInternetComponent } from './item-pass-internet/item-pass-internet.component';
import { ItemRechargeCreditComponent } from './item-recharge-credit/item-recharge-credit.component';
import { PipesModule } from '../pipes/pipes.module';
import { ItemRattachedNumberComponent } from './item-rattached-number/item-rattached-number.component';
import { RattachNumberModalComponent } from './rattach-number-modal/rattach-number-modal.component';
import { RattachNumberByIdCardComponent } from './rattach-number-by-id-card/rattach-number-by-id-card.component';
import { RattachNumberByClientCodeComponent } from './rattach-number-by-client-code/rattach-number-by-client-code.component';
import { MaterialComponentsModule } from '../material-components/material-components.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    ItemOfferPlanComponent,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    ItemRechargeCreditComponent,
    ItemRattachedNumberComponent,
    RattachNumberModalComponent,
    RattachNumberByIdCardComponent,
    RattachNumberByClientCodeComponent
  ],
  imports: [
    CommonModule,
    PipesModule,
    MaterialComponentsModule,
    IonicModule
  ],
  exports: [
    ItemOfferPlanComponent,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    ItemRechargeCreditComponent,
    ItemRattachedNumberComponent,RattachNumberModalComponent,RattachNumberByIdCardComponent,RattachNumberByClientCodeComponent
  ],
  entryComponents: [RattachNumberModalComponent]
})
export class ComponentsModule { }
