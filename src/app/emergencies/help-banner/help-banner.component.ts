import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-help-banner',
  templateUrl: './help-banner.component.html',
  styleUrls: ['./help-banner.component.scss']
})
export class HelpBannerComponent implements OnInit {
  @Input() text;
  @Input() helpType;
  redirectTo: string;
  constructor() {}

  ngOnInit() {
    if (this.helpType === 'rattachment') {
      this.redirectTo = '/dashboard';
    } else if(this.helpType === 'rattachment-by-id'){
      this.redirectTo = '/new-number'
    } else {
      this.redirectTo = '/control-center';
    }
  }
}
