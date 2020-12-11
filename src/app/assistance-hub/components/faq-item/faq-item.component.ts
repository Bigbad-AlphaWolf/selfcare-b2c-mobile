import { Component, Input, OnInit } from '@angular/core';
import { ItemBesoinAide } from 'src/shared';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrls: ['./faq-item.component.scss'],
})
export class FaqItemComponent implements OnInit {
  @Input() question: ItemBesoinAide;
  constructor() {}

  ngOnInit() {}
}
