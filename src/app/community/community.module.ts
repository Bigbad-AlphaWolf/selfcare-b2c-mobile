import {
  NO_ERRORS_SCHEMA,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CommunityPage } from './community.page';
import { VerticalArticleItemComponent } from './components/vertical-article-item/vertical-article-item.component';
import { HorizontalArticleItemComponent } from './components/horizontal-article-item/horizontal-article-item.component';
import { CategoryArticleItemComponent } from './components/category-article-item/category-article-item.component';
import { ArticleCommentItemComponent } from './components/article-comment-item/article-comment-item.component';
import { CommentBlockComponent } from './components/comment-block/comment-block.component';
import { ViewArticleComponent } from './pages/view-article/view-article.component';
import { ViewCategoryArticlesComponent } from './pages/view-category-articles/view-category-articles.component';
import { ViewArticlesCommentsComponent } from './pages/view-articles-comments/view-articles-comments.component';
import { AllCategoriesModalComponent } from './components/all-categories-modal/all-categories-modal.component';
import { ArticleSkeletonLoaderComponent } from './components/article-skeleton-loader/article-skeleton-loader.component';
import { MatInputModule } from '@angular/material';
import { PipesModule } from '../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: CommunityPage,
  },
  {
    path: 'article/:id',
    component: ViewArticleComponent,
  },
  {
    path: 'article',
    component: ViewArticleComponent,
  },
  {
    path: 'category-articles/:code',
    component: ViewCategoryArticlesComponent,
  },
  {
    path: 'category-articles',
    component: ViewCategoryArticlesComponent,
  },
  {
    path: 'article-comments/:id',
    component: ViewArticlesCommentsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    PipesModule,
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
    ViewCategoryArticlesComponent,
    ViewArticlesCommentsComponent,
    AllCategoriesModalComponent,
    ArticleSkeletonLoaderComponent,
  ],
  entryComponents: [AllCategoriesModalComponent],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class CommunityPageModule {}
