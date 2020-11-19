import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemOfferPlanComponent } from './item-offer-plan/item-offer-plan.component';
import { ItemPassIllimixComponent } from './item-pass-illimix/item-pass-illimix.component';
import { ItemPassInternetComponent } from './item-pass-internet/item-pass-internet.component';
import { ItemRechargeCreditComponent } from './item-recharge-credit/item-recharge-credit.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  declarations: [
    ItemOfferPlanComponent,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    ItemRechargeCreditComponent
  ],
  imports: [
    CommonModule,
    PipesModule
  ],
  exports: [
    ItemOfferPlanComponent,
    ItemPassIllimixComponent,
    ItemPassInternetComponent,
    ItemRechargeCreditComponent
  ]
})
export class ComponentsModule { }
