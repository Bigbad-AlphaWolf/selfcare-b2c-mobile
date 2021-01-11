import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-article-item',
  templateUrl: './category-article-item.component.html',
  styleUrls: ['./category-article-item.component.scss'],
})
export class CategoryArticleItemComponent implements OnInit {
  @Input() category;
  constructor() {}

  ngOnInit() {}
}
