import { Component, OnInit, Input } from '@angular/core';
import { RequestOem } from 'src/app/models/request-oem.model';

@Component({
  selector: 'oem-request-card',
  templateUrl: './request-card.component.html',
  styleUrls: ['./request-card.component.scss'],
})
export class RequestCardComponent implements OnInit {
  @Input('request') request: RequestOem;

  constructor() { }

  ngOnInit() { }

}
