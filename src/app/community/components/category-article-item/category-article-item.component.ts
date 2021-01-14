import { Component, Input, OnInit } from '@angular/core';
import { ArticleCategoryModel } from 'src/app/models/article.model';

@Component({
  selector: 'app-category-article-item',
  templateUrl: './category-article-item.component.html',
  styleUrls: ['./category-article-item.component.scss'],
})
export class CategoryArticleItemComponent implements OnInit {
  @Input() category: ArticleCategoryModel;
  constructor() {}

  ngOnInit() {}
}
