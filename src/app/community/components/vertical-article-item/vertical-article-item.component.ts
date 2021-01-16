import { Component, Input, OnInit } from '@angular/core';
import { ArticleModel, CommentModel } from 'src/app/models/article.model';
import { CommunityService } from 'src/app/services/community-service/community.service';
import { FILE_PATH } from 'src/app/services/utils/services.paths';
const SINGLE_REQUEST_SIZE = 5;
@Component({
  selector: 'app-vertical-article-item',
  templateUrl: './vertical-article-item.component.html',
  styleUrls: ['./vertical-article-item.component.scss'],
})
export class VerticalArticleItemComponent implements OnInit {
  @Input() article: ArticleModel;
  @Input() uniqueDisplay: boolean;
  showMore: boolean;
  comments: CommentModel[] = [];
  FILE_ENDPOINT = FILE_PATH;
  loadingComments: boolean;
  comments_page_number = 0;
  comments_max_size: number;
  infiniteScrollDisabled: boolean;
  constructor(private communityService: CommunityService) {}

  ngOnInit() {
    if (this.uniqueDisplay) {
      this.loadComments(true, {});
    }
  }

  loadComments(isFirstLoad: boolean, event, reqParams = {}) {
    this.loadingComments = true;
    reqParams = {
      ...{ size: SINGLE_REQUEST_SIZE, page: this.comments_page_number },
      ...reqParams,
    };
    console.log(reqParams);
    this.communityService
      .getArticlesComments(this.article)
      .subscribe((commentsResponse) => {
        if (isFirstLoad) {
          this.comments_max_size = +commentsResponse.headers.get(
            'X-Total-Count'
          );
          this.loadingComments = false;
        } else {
          event.target.complete();
        }
        this.comments = this.comments.concat(commentsResponse.body);
        if (this.comments.length === this.comments_max_size) {
          console.log('all comments loaded');
          this.infiniteScrollDisabled = true;
        } else {
          this.comments_page_number++;
        }
      });
  }

  showeMore() {
    this.showMore = !this.showMore;
  }
}
