import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-help-banner',
  templateUrl: './help-banner.component.html',
  styleUrls: ['./help-banner.component.scss'],
})
export class HelpBannerComponent implements OnInit {
  @Input() text;
  @Input() helpType;
  redirectTo: string;
  constructor(private navController: NavController) {}

  ngOnInit() {
    if (this.helpType === 'rattachment') {
      this.redirectTo = '/dashboard';
    } else if (this.helpType === 'rattachment-by-id') {
      this.redirectTo = '/new-number';
    } else {
      this.redirectTo = '/control-center';
    }
  }

  goBack() {
    this.navController.pop();
  }
}
