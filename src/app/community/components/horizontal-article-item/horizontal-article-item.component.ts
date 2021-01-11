import { Component, Input, OnInit } from '@angular/core';
import { ArticleModel } from 'src/app/models/article.model';

@Component({
  selector: 'app-horizontal-article-item',
  templateUrl: './horizontal-article-item.component.html',
  styleUrls: ['./horizontal-article-item.component.scss'],
})
export class HorizontalArticleItemComponent implements OnInit {
  @Input() article: ArticleModel;
  constructor() {}

  ngOnInit() {}
}
