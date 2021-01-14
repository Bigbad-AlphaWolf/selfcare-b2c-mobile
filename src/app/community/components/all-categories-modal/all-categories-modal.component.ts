import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ArticleCategoryModel } from 'src/app/models/article.model';

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
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  onCategorySelected(category) {
    this.modalController.dismiss({ category });
  }
}
