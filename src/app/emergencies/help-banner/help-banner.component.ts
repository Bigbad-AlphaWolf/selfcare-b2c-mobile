import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-help-banner',
  templateUrl: './help-banner.component.html',
  styleUrls: ['./help-banner.component.scss']
})
export class HelpBannerComponent implements OnInit {
  @Input() text;
  @Input() helpType;

  constructor() {}

  ngOnInit() {}
}
