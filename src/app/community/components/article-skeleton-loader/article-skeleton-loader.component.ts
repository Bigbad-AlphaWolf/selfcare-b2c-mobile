import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-skeleton-loader',
  templateUrl: './article-skeleton-loader.component.html',
  styleUrls: ['./article-skeleton-loader.component.scss'],
})
export class ArticleSkeletonLoaderComponent implements OnInit {
  @Input() isVertical: boolean;
  constructor() {}

  ngOnInit() {}
}
