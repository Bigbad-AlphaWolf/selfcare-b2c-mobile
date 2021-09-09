import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicImageLoader } from 'ionic-image-loader';
import { AssistanceHubPage } from './assistance-hub.page';
import { AssistanceActionsComponent } from './components/assistance-actions/assistance-actions.component';
import { AssistanceQuestionsComponent } from './components/assistance-questions/assistance-questions.component';
import { AssistanceSearchComponent } from './components/assistance-search/assistance-search.component';
import { PipesModule } from '../pipes/pipes.module';
import { SearchItemComponent } from './components/search-item/search-item.component';
import { SharedModule } from 'src/shared/shared.module';

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
  },
  {
    path: 'search',
    component: AssistanceSearchComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicImageLoader,
    SharedModule,
    PipesModule,
  ],
  declarations: [
    AssistanceHubPage,
    AssistanceActionsComponent,
    AssistanceQuestionsComponent,
    SearchItemComponent,
    AssistanceSearchComponent,
  ],
})
export class AssistanceHubPageModule {}
