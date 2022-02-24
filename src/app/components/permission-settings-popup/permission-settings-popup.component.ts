import { Component, OnInit } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-permission-settings-popup',
  templateUrl: './permission-settings-popup.component.html',
  styleUrls: ['./permission-settings-popup.component.scss'],
})
export class PermissionSettingsPopupComponent implements OnInit {
  isIos: boolean;

  constructor(
    private modalController: ModalController,
    private platform: Platform,
    private nativeSettings: OpenNativeSettings,
    private diagnostic: Diagnostic
  ) {}

  ngOnInit() {
    this.isIos = this.platform.is('ios');
  }

  close() {
    this.modalController.dismiss();
  }

  goSettings() {
    if (this.isIos) {
      this.nativeSettings.open('settings').then();
      this.modalController.dismiss();
      return;
    }
    this.diagnostic.getContactsAuthorizationStatus().then(async (status) => {
      if (status === this.diagnostic.permissionStatus.DENIED_ONCE) {
        await this.modalController.dismiss();
        this.diagnostic.requestContactsAuthorization().then();
      } else {
        this.nativeSettings.open('privacy').then();
        this.modalController.dismiss();
      }
    });
  }
}
