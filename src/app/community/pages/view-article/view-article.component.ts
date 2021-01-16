import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ArticleModel } from '../../../models/article.model';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss'],
})
export class ViewArticleComponent implements OnInit {
  article: ArticleModel = {
    imageHeader: '/assets/images/article-img.png',
    titre: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
    createdDate: `il y'a 5 min`,
  };
  constructor(private navController: NavController, private router: Router) {}

  ngOnInit() {
    this.getArticle();
  }

  getArticle() {
    this.article = this.router.getCurrentNavigation().extras.state.article;
  }

  goBack() {
    this.navController.pop();
  }
}
