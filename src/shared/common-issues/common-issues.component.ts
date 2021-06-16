import { Component, OnInit, NgZone, Input } from '@angular/core';
import { HelpModalDefaultContent } from '..';
import { Router } from '@angular/router';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-common-issues',
  templateUrl: './common-issues.component.html',
  styleUrls: ['./common-issues.component.scss'],
})
export class CommonIssuesComponent implements OnInit {
  popupTitle: string;
  options: {
    title: string;
    subtitle: string;
    type?: string;
    url?: string;
    action?: string;
    icon?: string;
    subOptions?: { title: string; subtitle: string; icon?: string }[];
  }[];
  showSousOption: boolean;
  type: string;
  @Input() data;
  constructor(
    private modalController: ModalController,
    private ngZone: NgZone,
    private router: Router,
    private openNativeSettings: OpenNativeSettings
  ) {}
  ngOnInit() {
    console.log(this.data);
    if (this.data) {
      this.options = this.data.options;
      this.popupTitle = this.data.popupTitle;
    }
  }

  goSuboption(option: {
    title: string;
    subtitle: string;
    type: string;
    url?: string;
    action?: string;
    subOptions: { title: string; subtitle: string }[];
  }) {
    if (!this.showSousOption) {
      this.options = option.subOptions;
      this.showSousOption = true;
      this.popupTitle = option.title;
      this.type = option.type;
    }
  }

  goBack() {
    this.showSousOption = false;
    this.options = this.data.options;
    this.popupTitle = this.data.popupTitle;
    this.type = null;
  }

  continue() {
    this.modalController.dismiss();
    switch (this.type) {
      case 'ERROR_AUTH_IMP':
        this.router.navigate(['/new-registration']);
        break;
      case 'FORGOT_PWD':
        this.router.navigate(['/forgotten-password']);
        break;
      case 'LOGIN':
        this.router.navigate(['/login']);
        break;
      case 'APN':
        this.openNativeSettings
          .open('settings')
          .then((res) => {})
          .catch((err) => {});
        break;
      default:
        break;
    }
  }
}
