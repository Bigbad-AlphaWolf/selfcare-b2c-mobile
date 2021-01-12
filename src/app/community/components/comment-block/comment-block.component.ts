import { Component, OnInit } from '@angular/core';

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
  subComments: any[] = [];
  constructor() {}

  ngOnInit() {}
}
