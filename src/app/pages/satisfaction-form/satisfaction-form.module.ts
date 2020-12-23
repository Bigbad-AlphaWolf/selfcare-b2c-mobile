import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SatisfactionFormPage } from './satisfaction-form.page';
import { SharedModule } from 'src/shared/shared.module';
import { ItemQuestionSatisfactionFormComponent } from './components/item-question-satisfaction-form/item-question-satisfaction-form.component';

const routes: Routes = [
  {
    path: '',
    component: SatisfactionFormPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SatisfactionFormPage, ItemQuestionSatisfactionFormComponent]
})
export class SatisfactionFormPageModule {}
