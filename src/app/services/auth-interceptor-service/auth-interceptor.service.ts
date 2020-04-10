import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import * as SecureLS from 'secure-ls';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
export const OmRequest = 'OrangeMoney';
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { OM_SERVICE_VERSION } from '../orange-money-service';

const ls = new SecureLS({ encodingType: 'aes' });
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authServ: AuthenticationService,
    private router: Router
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const that = this;
    const token = ls.get('token');
    const x_uuid = ls.get('X-UUID');

    if (isReqWaitinForUIDandMSISDN(req.url)) {
      let headers = req.headers;
      headers = headers.set('uuid', x_uuid);
      headers = headers.set('X-MSISDN', '221770167323');
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
      req.url.match('selfcare-otp') ||
      req.url.match('selfcare-b2c-account/api/account-management/account') ||
      req.url.match('auth/login')
    ) {
      return next.handle(req);
    }
    if (token) {
      let headers = req.headers;
      headers = headers.set('X-SELFCARE-SOURCE', 'mobile');
      headers = headers.set('Authorization', `Bearer ${token}`);

      req = req.clone({
        headers,
      });
    }

    let deviceInfo = window['device'];

    if (deviceInfo) {
      let headers = req.headers;
      headers = headers.set('X-SELFCARE-PLATFORM', deviceInfo.platform);
      headers = headers.set('X-SELFCARE-CORDOVA', deviceInfo.cordova);
      headers = headers.set('X-SELFCARE-MODEL', deviceInfo.model);
      headers = headers.set('X-SELFCARE-UUID', deviceInfo.uuid);
      headers = headers.set('X-SELFCARE-VERSION', deviceInfo.version);
      headers = headers.set('X-SELFCARE-MANUFACTURER', deviceInfo.manufacturer);
      headers = headers.set('X-SELFCARE-SERIAL', deviceInfo.serial);
      headers = headers.set(
        'X-SELFCARE-ISVIRTUAL',
        String(deviceInfo.isVirtual)
      );

      req = req.clone({
        headers,
      });
    }

    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              that.authServ.cleanCache();
              that.router.navigate(['login']);
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
  const urlGetMsisdn =
    'https://appom.orange-sonatel.com:1490/api/v1/get-msisdn';
  const urlConfirmMsisdn =
    'https://appom.orange-sonatel.com:1490/api/v1/confirm-msisdn';
  return url.match(urlGetMsisdn) || url.match(urlConfirmMsisdn);
}

function isReqWaitinForXUID(url: string) {
  const urlCheckNumber =
    'selfcare-b2c-account-management/api/account-management/v2/check_number';
  const urlRegister =
    'selfcare-b2c-account-management/api/account-management/v2/register';
  const urlResetPwd = 'selfcare-uaa/api/account/b2c/reset-password';
  return (
    url.match(urlCheckNumber) ||
    url.match(urlRegister) ||
    url.match(urlResetPwd)
  );
}

function isReqWaitinForUIDandMSISDN(url: string) {
  const urlDevGetMsisdn = 'http://10.100.99.116:1494/api/v1/get-msisdn';
  const urlDevConfMsisdn = `http://10.100.99.116:1494/api/v1/confirm-msisdn`;
  return url.match(urlDevGetMsisdn) || url.match(urlDevConfMsisdn);
}
