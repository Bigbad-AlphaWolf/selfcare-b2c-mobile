import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import * as SecureLS from 'secure-ls';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
export const OmRequest = 'OrangeMoney';
const ls = new SecureLS({ encodingType: 'aes' });
import * as jwt_decode from 'jwt-decode';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { OM_SERVICE_VERSION } from '../orange-money-service';
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authServ: AuthenticationService,
    private router: Router
  ) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const that = this;
    const token = ls.get('token');
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
      req.headers.set('X-SELFCARE-SOURCE', 'mobile');
      console.log(req.headers);
      return next.handle(req);
    }
    if (token) {
      let headers = req.headers;
      headers = headers.set('X-SELFCARE-SOURCE', 'mobile');
      headers = headers.set('Authorization', `Bearer ${token}`);
      req = req.clone({
        headers
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
                this.router.navigate(['dashboard']);
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
