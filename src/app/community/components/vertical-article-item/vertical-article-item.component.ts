import { Component, Input, OnInit } from '@angular/core';
import { ArticleModel } from 'src/app/models/article.model';

@Component({
  selector: 'app-vertical-article-item',
  templateUrl: './vertical-article-item.component.html',
  styleUrls: ['./vertical-article-item.component.scss'],
})
export class VerticalArticleItemComponent implements OnInit {
  @Input() article: ArticleModel;
  constructor() {}

  ngOnInit() {}
}
