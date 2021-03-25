import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { ArticleCategoryModel, ArticleModel } from '../models/article.model';
import { CommunityService } from '../services/community-service/community.service';
import { AllCategoriesModalComponent } from './components/all-categories-modal/all-categories-modal.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  categories: ArticleCategoryModel[] = [];
  articlesRecommendations: ArticleModel[];
  famousArticles: ArticleModel[];
  loadingFavoriteCategories: boolean;
  categoriesHasError: boolean;
  loadingRecommendedArticles: boolean;
  recommendedHasError: boolean;
  loadingFamousArticles: boolean;
  famousHasError: boolean;
  errorMessage = 'Erreur de chargement. Réactualisez ici';
  noArticleMsg = `Pas d'articles disponibles pour le moment`;

  constructor(
    private router: Router,
    private navController: NavController,
    private communityService: CommunityService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getMyFavouriteCategories();
    this.getRecommendedArticles();
    this.getFamousArticles();
  }

  goBack() {
    this.navController.pop();
  }

  goToArticle(article) {
    this.router.navigate([`/community/article`], { state: { article } });
  }

  goToCategory(category) {
    this.router.navigate([`/community/category-articles`], {
      state: { category },
    });
  }

  getMyFavouriteCategories() {
    this.loadingFavoriteCategories = true;
    this.categoriesHasError = false;
    this.communityService.getArticlesCategories().subscribe(
      (categories) => {
        this.categories = categories;
        this.loadingFavoriteCategories = false;
      },
      (err) => {
        this.categoriesHasError = true;
        this.loadingFavoriteCategories = false;
      }
    );
  }

  getRecommendedArticles() {
    this.loadingRecommendedArticles = true;
    this.recommendedHasError = false;
    this.communityService.getRecommendedArticles().subscribe(
      (recommended) => {
        this.articlesRecommendations = recommended;
        this.loadingRecommendedArticles = false;
      },
      (err) => {
        this.recommendedHasError = true;
        this.loadingRecommendedArticles = false;
      }
    );
  }

  getFamousArticles() {
    this.loadingFamousArticles = true;
    this.famousHasError = false;
    this.communityService.getFamousArticles().subscribe(
      (famous) => {
        this.famousArticles = famous;
        this.loadingFamousArticles = false;
      },
      (err) => {
        this.famousHasError = true;
        this.loadingFamousArticles = false;
      }
    );
  }

  async openAllCategories() {
    const modal = await this.modalController.create({
      component: AllCategoriesModalComponent,
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data) {
        const category = resp.data.category;
        this.goToCategory(category);
      }
    });
    return await modal.present();
  }
}
