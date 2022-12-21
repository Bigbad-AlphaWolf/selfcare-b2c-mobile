import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import * as SecureLS from 'secure-ls';
import { tap, delay, retryWhen, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
export const OmRequest = 'OrangeMoney';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { OM_SERVICE_VERSION } from '../orange-money-service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { checkUrlMatchOM, checkUrlNotNeedAuthorization } from 'src/app/utils/utils';
import { NewPinpadModalPage } from 'src/app/new-pinpad-modal/new-pinpad-modal.page';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AppComponent } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
const { AUTH_IMPLICIT_MSISDN } = environment;

const ls = new SecureLS({ encodingType: 'aes' });
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  appVersionNumber: string;
  constructor(private authServ: AuthenticationService, private router: Router, private appVersion: AppVersion, private modalController: ModalController) {
    this.appVersion
      .getVersionNumber()
      .then(value => {
        this.appVersionNumber = value;
      })
      .catch(error => {
        console.log(error);
      });
  }

  async resetOmToken(err) {
    console.log(err);
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: null,
      },
    });
    await modal.present();
    let result = await modal.onDidDismiss();
    if (result && result.data && result.data.success) return of(err);
    throw new HttpErrorResponse({
      error: { title: 'Pinpad cancled' },
      status: 401,
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const that = this;
    const token = ls.get('token');
    let x_uuid = ls.get('X-UUID');
    const imei = AppComponent.IMEI;
    if (checkUrlMatchOM(req.url)) {
      if (!x_uuid || x_uuid === '') {
        const uuidV4 = uuidv4();
        ls.set('X-UUID', uuidV4);
        x_uuid = ls.get('X-UUID');
      }

      req = req.clone({
        body: { ...req.body, uuid: x_uuid },
      });
    }
    const lightToken = ls.get('light-token');
    if (isReqWaitinForUIDandMSISDN(req.url)) {
      let headers = req.headers;
      headers = headers.set('uuid', x_uuid);
      headers = headers.set('X-MSISDN', AUTH_IMPLICIT_MSISDN);
      //delay to test slowness of network
      req = req.clone({
        headers,
      });
    }
    if (isReqWaitinForUID(req.url)) {
      let headers = req.headers;
      headers = headers.set('uuid', x_uuid);
      req = req.clone({
        headers,
      });
    }
    if (isReqWaitinForXUID(req.url)) {
      let headers = req.headers;
      headers = headers.set('X-UUID', x_uuid);
      req = req.clone({
        headers,
      });
    }
    if (req.headers.has(OmRequest)) {
      req.headers.set('service_version', OM_SERVICE_VERSION);
      return next.handle(req);
    }
    // Not send token for dev endpoints
    if (
      //req.url.match('selfcare-otp') ||
      req.url.match('selfcare-b2c-account/api/account-management/account')
      //req.url.match('auth/login')
    ) {
      req.headers.set('X-Selfcare-Source', 'mobile');
      return next.handle(req);
    }
    if (lightToken) {
      let headers = req.headers.set('X-Selfcare-UUID', x_uuid).set('Authorization', `Bearer ${lightToken}`);
      req = req.clone({
        headers,
      });
    }
    if (imei) {
      let headers = req.headers;
      headers = headers.set('X-Selfcare-Device-Imei', imei);
      req = req.clone({
        headers,
      });
    }
    if (token) {
      let headers = req.headers;
      headers = headers.set('Content-Type', 'application/json; charset=UTF-8');
      headers = headers.set('X-Selfcare-Source', 'mobile');
      headers = headers.set('Authorization', `Bearer ${token}`);
      headers = headers.set('Access-Control-Allow-Origin', '*');
      req = req.clone({
        headers,
      });
    }
    let deviceInfo = window['device'];

    if (deviceInfo) {
      let headers = req.headers;
      headers = headers.set('X-Selfcare-Platform', deviceInfo.platform);
      headers = headers.set('X-Selfcare-Cordova', deviceInfo.cordova);
      headers = headers.set('X-Selfcare-Model', deviceInfo.model);
      headers = headers.set('X-Selfcare-Uuid', x_uuid);
      headers = headers.set('X-Selfcare-Os-Version', deviceInfo.version);
      headers = headers.set('X-Selfcare-Manufacturer', deviceInfo.manufacturer);
      headers = headers.set('X-Selfcare-Serial', deviceInfo.serial);
      headers = headers.set('X-Selfcare-Isvirtual', String(deviceInfo.isVirtual));

      if (this.appVersionNumber) headers = headers.set('X-Selfcare-App-Version', this.appVersionNumber);

      req = req.clone({
        headers,
      });
    }
    let headers = req.headers.set('X-Selfcare-Uuid', x_uuid);
    req = req.clone({
      headers,
    });
    if (checkUrlNotNeedAuthorization(req.url)) {
      let headers = req.headers.delete('Authorization');
      req = req.clone({
        headers,
      });
    }
    return next.handle(req).pipe(
      retryWhen(err => {
        return err.pipe(
          switchMap(async err => {
            if (err.status === 401 && checkUrlMatchOM(err.url) && !err.statusText) return await this.resetOmToken(err);
            throw err;
          })
        );
      }),
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401 && !checkUrlMatchOM(err.url)) {
              that.authServ.cleanCache();
              that.router.navigate(['']);
            }
            if (err.status === 403) {
              // check if token is expired, if yes go to login page
              const currentTime = new Date().getTime() / 1000;
              const jwt = jwt_decode(token);
              if (token && currentTime > jwt.exp) {
                that.authServ.cleanCache();
                that.router.navigate(['login']);
              } else {
                // this.router.navigate(['dashboard']);
              }
            }
            if (err.status === 500) {
            }
          }
        }
      )
    );
  }
}

function isReqWaitinForUID(url: string) {
  const urlGetMsisdn = 'https://appom.orange-sonatel.com:1490/api/v1/get-msisdn';
  const urlConfirmMsisdn = 'https://appom.orange-sonatel.com:1490/api/v1/confirm-msisdn';
  return url.match(urlGetMsisdn) || url.match(urlConfirmMsisdn);
}

function isReqWaitinForXUID(url: string) {
  const urlCheckNumber = 'selfcare-b2c-account-management/api/account-management/v2/check_number';
  const urlRegister = 'selfcare-b2c-account-management/api/account-management/v2/register';
  const urlCheckNumberv3 = 'selfcare-b2c-account-management/api/account-management/v3/check_number';
  const urlRegisterv3 = 'selfcare-b2c-account-management/api/account-management/v3/register';
  const urlResetPwd = 'selfcare-b2c-uaa/api/account/b2c/reset-password';
  const urlResetPwdV2 = 'selfcare-b2c-uaa/api/v2/lite/account/b2c/reset-password';
  return url.match(urlCheckNumber) || url.match(urlRegister) || url.match(urlResetPwd) || url.match(urlCheckNumberv3) || url.match(urlRegisterv3) || url.match(urlResetPwdV2);
}

function isReqWaitinForUIDandMSISDN(url: string) {
  const urlDevGetMsisdn = 'http://10.100.99.116:1494/api/v1/get-msisdn';
  const urlDevConfMsisdn = `http://10.100.99.116:1494/api/v1/confirm-msisdn`;
  return url.match(urlDevGetMsisdn) || url.match(urlDevConfMsisdn);
}
