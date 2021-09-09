import { Component, Input, OnInit } from '@angular/core';
import { OffreService } from 'src/app/models/offre-service.model';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrls: ['./faq-item.component.scss'],
})
export class FaqItemComponent implements OnInit {
  @Input() question: OffreService;
  constructor() {}

  ngOnInit() {}
}
