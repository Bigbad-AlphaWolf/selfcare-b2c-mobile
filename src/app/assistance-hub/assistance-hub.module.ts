import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AssistanceHubPage } from './assistance-hub.page';
import { AssistanceActionsComponent } from './components/assistance-actions/assistance-actions.component';
import { AssistanceQuestionsComponent } from './components/assistance-questions/assistance-questions.component';
import { ActionItemComponent } from './components/action-item/action-item.component';
import { FaqItemComponent } from './components/faq-item/faq-item.component';

const routes: Routes = [
  {
    path: '',
    component: AssistanceHubPage,
  },
  {
    path: 'actions',
    component: AssistanceActionsComponent,
  },
  {
    path: 'questions',
    component: AssistanceQuestionsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    AssistanceHubPage,
    AssistanceActionsComponent,
    AssistanceQuestionsComponent,
    ActionItemComponent,
    FaqItemComponent,
  ],
})
export class AssistanceHubPageModule {}
