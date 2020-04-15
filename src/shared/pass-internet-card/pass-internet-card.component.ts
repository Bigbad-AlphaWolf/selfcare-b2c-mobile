import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pass-internet-card',
  templateUrl: './pass-internet-card.component.html',
  styleUrls: ['./pass-internet-card.component.scss'],
})
export class PassInternetCardComponent implements OnInit {
  @Input() passInternet: any;

  constructor() {}

  ngOnInit() {}
}
