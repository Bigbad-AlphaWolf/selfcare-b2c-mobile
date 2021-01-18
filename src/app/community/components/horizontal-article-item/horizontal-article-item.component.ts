import { Component, Input, OnInit } from '@angular/core';
import { ArticleModel } from 'src/app/models/article.model';
import { CommunityService } from 'src/app/services/community-service/community.service';
import { FILE_PATH } from 'src/app/services/utils/services.paths';

@Component({
  selector: 'app-horizontal-article-item',
  templateUrl: './horizontal-article-item.component.html',
  styleUrls: ['./horizontal-article-item.component.scss'],
})
export class HorizontalArticleItemComponent implements OnInit {
  @Input() article: ArticleModel;
  FILE_ENDPOINT = FILE_PATH;
  comments_max_size: number = 0;

  constructor(private communityService: CommunityService) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    const reqParams = {
      size: 2,
      page: 0,
    };
    this.communityService
      .getArticlesComments(this.article, reqParams)
      .subscribe((commentsResponse) => {
        this.comments_max_size = +commentsResponse.headers.get('X-Total-Count');
      });
  }
}
