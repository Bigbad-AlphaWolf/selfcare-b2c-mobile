import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ArticleModel } from 'src/app/models/article.model';
import { CommunityService } from 'src/app/services/community-service/community.service';

@Component({
  selector: 'app-view-category-articles',
  templateUrl: './view-category-articles.component.html',
  styleUrls: ['./view-category-articles.component.scss'],
})
export class ViewCategoryArticlesComponent implements OnInit {
  articles: ArticleModel[] = [
    {
      imageHeader: '/assets/images/article-img.png',
      titre:
        'Gagne des tickets pour le Concert de Samba Peuzziéééééééééééééé !',
      createdDate: `il y'a 5 min`,
    },
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

  constructor(
    private router: Router,
    private navController: NavController,
    private communityService: CommunityService
  ) {}

  ngOnInit() {}

  goBack() {
    this.navController.pop();
  }

  goToArticle(article) {
    this.router.navigate([`/community/article/1`]);
    // this.router.navigate([`/community/article/${article.id}`])
  }
}
