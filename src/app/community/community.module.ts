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
import { ViewArticleComponent } from './components/view-article/view-article.component';
import { ArticleCommentItemComponent } from './components/article-comment-item/article-comment-item.component';
import { CommentBlockComponent } from './components/comment-block/comment-block.component';

const routes: Routes = [
  {
    path: '',
    component: CommunityPage,
  },
  {
    path: 'article/:id',
    component: ViewArticleComponent,
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
    ViewArticleComponent,
    ArticleCommentItemComponent,
    CommentBlockComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityPageModule {}
