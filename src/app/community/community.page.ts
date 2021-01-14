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
  categories: ArticleCategoryModel[] = [
    {
      name: 'Bons plans',
      colorCode: '#ff7900',
      image: '/assets/images/article-img.png',
    },
    {
      name: 'Coin Geek',
      colorCode: '#a885d8',
      image: '/assets/images/article-img.png',
    },
    {
      name: 'Divertissement',
      colorCode: '#ffcc00',
      image: '/assets/images/article-img.png',
    },
    {
      name: 'Culture / Education',
      colorCode: '#50be87',
      image: '/assets/images/article-img.png',
    },
    {
      name: 'Santé / Bien-être',
      colorCode: '#50be87',
      image: '/assets/images/article-img.png',
    },
    {
      name: 'Cinéma',
      colorCode: '#ffb4e6',
      image: '/assets/images/article-img.png',
    },
  ];
  articlesRecommendations: ArticleModel[] = [
    {
      imageHeader: '/assets/images/article-img.png',
      titre: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
      createdDate: `il y'a 5 min`,
    },
    {
      imageHeader: '/assets/images/article-img.png',
      titre: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
      createdDate: `il y'a 5 min`,
    },
  ];
  famousArticles: ArticleModel[] = [
    {
      imageHeader: '/assets/images/article-image.png',
      titre: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
      createdDate: `il y'a 5 min`,
    },
  ];

  constructor(
    private router: Router,
    private navController: NavController,
    private communityService: CommunityService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  goBack() {
    this.navController.pop();
  }

  goToArticle(article) {
    this.router.navigate([`/community/article/1`]);
    // this.router.navigate([`/community/article/${article.id}`])
  }

  goToCategory(category) {
    this.router.navigate([`/community/category-articles/code`]);
    // this.router.navigate([`/category-articles/${category.code}`])
  }

  getMyFavouriteCategories() {
    this.communityService.getArticlesCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  async openAllCategories() {
    const modal = await this.modalController.create({
      component: AllCategoriesModalComponent,
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then((resp) => {
      if (resp && resp.data) {
        const category = resp.data.category;
        this.goToArticle(category);
      }
    });
    return await modal.present();
  }

  getRecommendedArticles() {}

  getFamousArticles() {}
}
