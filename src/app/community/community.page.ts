import { Component, OnInit } from '@angular/core';
import { ArticleModel } from '../models/article.model';

@Component({
  selector: 'app-community',
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
})
export class CommunityPage implements OnInit {
  categories: any[] = [
    {
      nom: 'Bons plans',
      color: '#ff7900',
      image: '/assets/images/article-img.png',
    },
    {
      nom: 'Coin Geek',
      color: '#a885d8',
      image: '/assets/images/article-img.png',
    },
    {
      nom: 'Divertissement',
      color: '#ffcc00',
      image: '/assets/images/article-img.png',
    },
    {
      nom: 'Culture / Education',
      color: '#50be87',
      image: '/assets/images/article-img.png',
    },
  ];
  articlesRecommendations: ArticleModel[] = [
    {
      image: '/assets/images/article-img.png',
      title: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
      description: '',
      createdDate: `il y'a 5 min`,
    },
    {
      image: '/assets/images/article-img.png',
      title: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
      description: '',
      createdDate: `il y'a 5 min`,
    },
  ];
  famousArticles: ArticleModel[] = [
    {
      image: '/assets/images/article-image.png',
      title: 'Gagne des tickets pour le Concert de Samba Peuzzi !',
      description: '',
      createdDate: `il y'a 5 min`,
    },
  ];

  constructor() {}

  ngOnInit() {}

  goBack() {}
}
