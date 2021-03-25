import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  ArticleCategoryModel,
  ArticleModel,
} from 'src/app/models/article.model';
import { CommunityService } from 'src/app/services/community-service/community.service';
const SINGLE_REQUEST_SIZE = 5;

@Component({
  selector: 'app-view-category-articles',
  templateUrl: './view-category-articles.component.html',
  styleUrls: ['./view-category-articles.component.scss'],
})
export class ViewCategoryArticlesComponent implements OnInit {
  articles: ArticleModel[];
  category: ArticleCategoryModel;
  // param page to get articles
  page = 0;
  // the total number of articles for current category
  maxSize: number;
  // boolean to know if all articles are loaded
  maxNumberReached: boolean;
  loadingArticles: boolean;
  hasError: boolean;
  noArticleMsg = `Pas d'articles disponibles pour le moment`;
  errorMessage = 'Erreur de chargement. Réactualisez ici';
  constructor(
    private router: Router,
    private navController: NavController,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.getCategory();
  }

  getCategory() {
    this.category = this.router.getCurrentNavigation().extras.state.category;
    this.getArticles(true, {});
  }

  getArticles(isFirstLoad: boolean, event?) {
    this.loadingArticles = true;
    this.hasError = false;
    const reqParams = {
      size: SINGLE_REQUEST_SIZE,
      page: this.page,
    };
    this.communityService
      .getArticlesByCategory(this.category, reqParams)
      .subscribe(
        (articlesResponse) => {
          this.loadingArticles = false;
          if (isFirstLoad) {
            this.maxSize = +articlesResponse.headers.get('X-Total-Count');
            this.articles = [];
          } else if (event) {
            event.target.complete();
          }
          this.articles = this.articles.concat(articlesResponse.body);
          if (this.articles.length === this.maxSize) {
            console.log('all articles loaded');
            this.maxNumberReached = true;
          } else {
            this.page++;
          }
        },
        (err) => {
          this.loadingArticles = false;
          if (isFirstLoad) {
            this.hasError = true;
          }
        }
      );
  }

  goBack() {
    this.navController.pop();
  }

  goToArticle(article) {
    this.router.navigate([`/community/article`], { state: { article } });
  }
}
