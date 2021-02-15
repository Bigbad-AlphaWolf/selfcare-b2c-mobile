import { Component, Input, OnInit } from '@angular/core';
import { ArticleCategoryModel } from 'src/app/models/article.model';
import { FILE_PATH } from 'src/app/services/utils/services.paths';

@Component({
  selector: 'app-category-article-item',
  templateUrl: './category-article-item.component.html',
  styleUrls: ['./category-article-item.component.scss'],
})
export class CategoryArticleItemComponent implements OnInit {
  @Input() category: ArticleCategoryModel;
  FILE_ENDPOINT = FILE_PATH;
  constructor() {}

  ngOnInit() {}
}
