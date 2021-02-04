import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import { isNewVersion } from 'src/shared';
import { NavController, Platform } from '@ionic/angular';
import { AssistanceService } from '../assistance.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SessionOem } from '../session-oem/session-oem.service';
import { AppUpdatePage } from 'src/app/pages/app-update/app-update.page';

@Injectable({
  providedIn: 'root'
})
export class AuthUpdateGuard implements CanActivate {
  currentProfil;
  isIOS: boolean;
  appId: string;
  currentAppVersion: string;

  constructor(
    private assistanceService: AssistanceService,
    private appVersion: AppVersion,
    private navCtl: NavController,
    private platform: Platform
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    if (this.platform.is('ios')) {
      this.isIOS = true;
      this.appId = 'orange-et-moi-sénégal/id1039327980';
    } else if (this.platform.is('android')) {
      this.appId = 'com.orange.myorange.osn';
    }
    this.checkForUpdate();

    return true;
  }


  async checkForUpdate() {
    this.currentAppVersion = await this.appVersion.getVersionNumber();

    if (this.appId && this.currentAppVersion)
      this.assistanceService
        .getAppVersionPublished()
        .subscribe((version: any) => {
          const versionAndroid = version.android;
          const versionIos = version.ios;
          const forceUpdate = version.forceUpdateApp;

          if (versionAndroid || versionIos) {
            if (
              isNewVersion(
                this.isIOS ? versionIos : versionAndroid,
                this.currentAppVersion
              )
            ) {
              if(!SessionOem.updateAbort)
              this.navCtl.navigateForward([AppUpdatePage.ROUTE_PATH], {
                state: { appId: this.appId, forceUpdate: forceUpdate },
              });
            }
          }
        });
  }
}
