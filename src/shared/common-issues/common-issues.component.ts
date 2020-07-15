import { Component, OnInit, Input, Inject, NgZone } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-common-issues',
  templateUrl: './common-issues.component.html',
  styleUrls: ['./common-issues.component.scss'],
})
export class CommonIssuesComponent implements OnInit {
  popupTitle: string;
  popupSubtitle: string;
  options: {
    title: string;
    subtitle: string;
    type: 'ERROR_AUTH_IMP' | 'REGISTER' | 'LOGIN' | 'FORGOT_PWD';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[];
  showChecks: boolean = false;
  @Input() data;
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.data) {
      this.showChecks = this.data.showChecks;
      this.options = this.data.options;
      this.popupTitle = this.data.popupTitle;
      this.popupSubtitle = this.data.popupSubtitle;
    }
  }

  close(message?: string) {
    this.modalController.dismiss(message);
  }

  makeAction(option: {
    title: string;
    subtitle: string;
    type:
      | ''
      | 'ERROR_AUTH_IMP'
      | 'REGISTER'
      | 'LOGIN'
      | 'FORGOT_PWD'
      | 'APN_AUTH_IMP'
      | 'DATA_AUTH_IMP'
      | 'WIFI_AUTH_IMP'
      | 'CONFIG_APN_AUTH_IMP';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    switch (option.type) {
      case 'REGISTER':
        if (option.action === 'REDIRECT') {
          this.router.navigate(['/new-registration']);
        }
        this.close();
        break;
      case 'LOGIN':
        if (option.action === 'REDIRECT') {
          this.router.navigate(['/login']);
        }
        this.close();
        break;
      case 'FORGOT_PWD':
        if (option.action === 'REDIRECT') {
          this.router.navigate(['/forgotten-password']);
        }
        this.close();
        break;
      case 'ERROR_AUTH_IMP':
        this.close('ERROR_AUTH_IMP');
        break;
      case 'APN_AUTH_IMP':
        this.close('APN_AUTH_IMP');
        break;
      case 'DATA_AUTH_IMP':
        this.close('DATA_AUTH_IMP');
        break;
      case 'WIFI_AUTH_IMP':
        this.close('WIFI_AUTH_IMP');
        break;
      case 'CONFIG_APN_AUTH_IMP':
        this.close('CONFIG_APN_AUTH_IMP');
        break;
      default:
        break;
    }
  }
}
