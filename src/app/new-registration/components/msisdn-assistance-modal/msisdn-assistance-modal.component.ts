import { Component, Input, OnInit } from '@angular/core';
import { GET_MSISDN_ENUM } from 'src/shared';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { ModalController, Platform } from '@ionic/angular';
import {
  AuthenticationService,
  ConfirmMsisdnModel,
} from 'src/app/services/authentication-service/authentication.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-msisdn-assistance-modal',
  templateUrl: './msisdn-assistance-modal.component.html',
  styleUrls: ['./msisdn-assistance-modal.component.scss'],
})
export class MsisdnAssistanceModalComponent implements OnInit {
  @Input() step: GET_MSISDN_ENUM = GET_MSISDN_ENUM.DISABLE_WIFI;
  GET_MSISDN_ENUM = GET_MSISDN_ENUM;
  wifiEnabled: boolean;
  isIos: boolean;
  buttonEnabled: boolean;
  listener: any;

  constructor(
    //private wifiWizard2: WifiWizard2,
    private network: Network,
    private platform: Platform,
    private openNativeSettings: OpenNativeSettings,
    private modalController: ModalController,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.isIos = this.platform.is('ios');
    this.checkStatus();
    this.listenSettingsChanged();
  }

  async checkStatus() {
    //this.wifiEnabled = await this.wifiWizard2.isWifiEnabled();
    //if (this.wifiEnabled) {
    //  this.step = GET_MSISDN_ENUM.DISABLE_WIFI;
    //} else {
    //  this.step = GET_MSISDN_ENUM.ENABLE_4G;
    //}
  }

  listenSettingsChanged() {
    this.listener = setInterval(async () => {
      console.log('called');
      if (this.step === GET_MSISDN_ENUM.DISABLE_WIFI) {
        //this.wifiEnabled = await this.wifiWizard2.isWifiEnabled();
        this.buttonEnabled = !this.wifiEnabled;
      } else if (this.step === GET_MSISDN_ENUM.ENABLE_4G) {
        if (
          this.network.type === '4g' ||
          this.network.type === '3g' ||
          this.network.type === '2g'
        ) {
          const msisdn = await this.getMsisdn();
        }
      }
    }, 500);
  }

  getMsisdn() {
    return this.authServ
      .getMsisdnByNetwork()
      .pipe(
        catchError(() => {
          return of(null);
        }),
        switchMap((res: { msisdn: string }) => {
          return this.authServ.confirmMsisdnByNetwork(res.msisdn).pipe(
            map((res: ConfirmMsisdnModel) => {
              if (res?.status) {
                this.buttonEnabled = true;
                clearInterval(this.listener);
                return of(res);
              }
            }),
            catchError((err) => {
              return of(null);
            })
          );
        })
      )
      .toPromise();
  }

  accessSettings() {
    // clearInterval(this.listener);
    if (this.step === GET_MSISDN_ENUM.DISABLE_WIFI) {
      this.openNativeSettings.open('wifi').then();
    } else if (this.step === GET_MSISDN_ENUM.ENABLE_4G) {
      this.isIos
        ? this.openNativeSettings.open('mobile_data').then()
        : this.openNativeSettings.open('wireless').then();
    }
  }

  next() {
    if (this.step === GET_MSISDN_ENUM.DISABLE_WIFI) {
      this.buttonEnabled = false;
      this.step = GET_MSISDN_ENUM.ENABLE_4G;
    } else if (this.step === GET_MSISDN_ENUM.ENABLE_4G) {
      this.modalController.dismiss();
    }
  }
}
