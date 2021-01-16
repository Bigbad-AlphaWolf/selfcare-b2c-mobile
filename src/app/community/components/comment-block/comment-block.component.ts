import { Component, Input, OnInit } from '@angular/core';
import { ArticleModel, CommentModel } from 'src/app/models/article.model';
import { CommunityService } from 'src/app/services/community-service/community.service';
const SINGLE_REQUEST_SIZE = 3;
@Component({
  selector: 'app-comment-block',
  templateUrl: './comment-block.component.html',
  styleUrls: ['./comment-block.component.scss'],
})
export class CommentBlockComponent implements OnInit {
  // param page to get sub comments
  subCommentPageNumber = 0;
  // the total number of subcomments for current comment
  maxSubCommentNumber: number;
  // boolean to know if all sub comments are loaded
  maxNumberReached: boolean;
  loadingSubComments: boolean;
  subComments: any[] = [];
  @Input() comment: CommentModel;
  constructor(private communityService: CommunityService) {}

  ngOnInit() {}

  loadSubComments(isFirstLoad: boolean, event, reqParams = {}) {
    this.loadingSubComments = true;
    reqParams = {
      ...{ size: SINGLE_REQUEST_SIZE, page: this.subCommentPageNumber },
      ...reqParams,
    };
    this.communityService
      .getArticlesComments(this.comment)
      .subscribe((commentsResponse) => {
        if (isFirstLoad) {
          this.maxSubCommentNumber = +commentsResponse.headers.get(
            'X-Total-Count'
          );
          this.loadingSubComments = false;
        } else {
          event.target.complete();
        }
        this.subComments = this.subComments.concat(commentsResponse.body);
        if (this.subComments.length === this.maxSubCommentNumber) {
          console.log('all subComments loaded');
          this.maxNumberReached = true;
        } else {
          this.subCommentPageNumber++;
        }
      });
  }
}
