import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArticleCategoryModel } from 'src/app/models/article.model';
import { CommunityService } from 'src/app/services/community-service/community.service';

@Component({
  selector: 'app-all-categories-modal',
  templateUrl: './all-categories-modal.component.html',
  styleUrls: ['./all-categories-modal.component.scss'],
})
export class AllCategoriesModalComponent implements OnInit {
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
      colorCode: '#4bb4e6',
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
  loadingCategories: boolean;
  hasErrorLoading: boolean;
  constructor(
    private modalController: ModalController,
    private communityService: CommunityService
  ) {}

  ngOnInit() {
    this.getAllCategories();
  }

  onCategorySelected(category) {
    this.modalController.dismiss({ category });
  }

  getAllCategories() {
    this.loadingCategories = true;
    this.hasErrorLoading = false;
    this.communityService.getArticlesCategories().subscribe(
      (categories) => {
        this.loadingCategories = false;
        this.categories = categories;
      },
      (err) => {
        this.loadingCategories = false;
        this.hasErrorLoading = true;
      }
    );
  }
}
