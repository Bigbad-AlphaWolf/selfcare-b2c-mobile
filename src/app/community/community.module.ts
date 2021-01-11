import {
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommunityPage } from './community.page';
import { VerticalArticleItemComponent } from './components/vertical-article-item/vertical-article-item.component';
import { HorizontalArticleItemComponent } from './components/horizontal-article-item/horizontal-article-item.component';
import { CategoryArticleItemComponent } from './components/category-article-item/category-article-item.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    CommunityPage,
    VerticalArticleItemComponent,
    HorizontalArticleItemComponent,
    CategoryArticleItemComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityPageModule {}
