import { Component, OnInit } from '@angular/core';
import { ArticleModel } from '../../../models/article.model';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss'],
})
export class ViewArticleComponent implements OnInit {
  article: ArticleModel = {
    image: '/assets/images/article-img.png',
    title: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
    description: '',
    createdDate: `il y'a 5 min`,
  };
  constructor() {}

  ngOnInit() {}
}
