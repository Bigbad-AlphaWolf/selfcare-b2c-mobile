import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/shared/shared.module';
import { IlliflexBudgetConfigurationPage } from './illiflex-budget-configuration.page';
import { IlliflexSetAmountModalComponent } from './components/illiflex-set-amount-modal/illiflex-set-amount-modal.component';
import { GaugeKnobDirective } from '../directives/gauge-range-knob-style/gauge-knob.directive';

const routes: Routes = [
  {
    path: '',
    component: IlliflexBudgetConfigurationPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    IlliflexBudgetConfigurationPage,
    IlliflexSetAmountModalComponent,
    GaugeKnobDirective,
  ],
  entryComponents: [IlliflexSetAmountModalComponent],
})
export class IlliflexBudgetConfigurationPageModule {}
