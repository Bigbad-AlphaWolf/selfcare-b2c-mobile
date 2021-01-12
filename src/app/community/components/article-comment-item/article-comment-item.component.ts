import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-article-comment-item',
  templateUrl: './article-comment-item.component.html',
  styleUrls: ['./article-comment-item.component.scss'],
})
export class ArticleCommentItemComponent implements OnInit {
  @Input() isSubComment: boolean;
  showMore: boolean;
  constructor() {}

  ngOnInit() {}

  showeMore() {
    this.showMore = !this.showMore;
  }
}
