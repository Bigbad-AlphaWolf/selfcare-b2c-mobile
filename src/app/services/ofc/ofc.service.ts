import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import * as SecureLS from 'secure-ls';

const ls = new SecureLS({ encodingType: 'aes' });
@Injectable({
  providedIn: 'root',
})
export class OfcService {
  ofcLoadTimes = 0;
  static OFC_WEBVIEW_URL = 'https://webview.iaascore.com/?lang=fr';
  constructor(private httpNative: HTTP, private inAppBrowser: InAppBrowser) {}

  loadOFCCookiestest() {
    this.httpNative.setServerTrustMode('nocheck');
    return this.httpNative.get(
      OfcService.OFC_WEBVIEW_URL,
      {},
      {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJPRkM6MjIxNzgyMzYzNTcyIiwidXNlcl9uYW1lIjoiNzgyMzYzNTcyIiwic2NvcGUiOlsib3BlbmlkIl0sImV4cCI6MTYxMTg0NTg1NSwiaWF0IjoxNjA5MjUzODU1LCJhdXRob3JpdGllcyI6WyJST0xFX0IyQ19BQk9OTkUiXSwianRpIjoiMjNjMjkwN2ItMDkyOS00OGEwLTg5OTItYWVhZWFiM2Q2NTJjIiwiY2xpZW50X2lkIjoid2ViX2FwcCJ9.Lt5VASjj3ogab5yvQmXl7KAYbXDmxCG1zJ4Fo-jN0UU9Urcd7Rx5lbdLB2ejY6XxgexNH5Yz7S-ltYZenyEcaMETFeR64lIONsALOFI-sCOTFReQfhbRqwMyGLuGk3DyTjcwecJJXkT6T5IP80mxBW4kuycl3BRd3tPY69TITBhp9XuYb4Ueo_HGjpr_4ljd22m3J_u-EAwRVAuuTe3VtVZFjQ1lW_cclwhc-wyj3m1YHPYTwKaF-vW_3rcNsMex6848e7Go-_qlhtCqVRLJWJDpKzVE8Cf3LQdppCeW-QIIcYkNRJ81SnSl3KYfRaUL7JtDQx5X-HNrlfA6dMdlGQ`,
      }
    );
  }
  loadOFCCookies() {
    const token = ls.get('token');
    this.httpNative.setServerTrustMode('nocheck');
    return this.httpNative.get(
      OfcService.OFC_WEBVIEW_URL,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }

  loadOFC(cookies: string[] = null) {
    if (this.ofcLoadTimes >= 3) return;
    const hidden = !cookies ? ',hidden=yes' : '';
    var browser = this.inAppBrowser.create(
      OfcService.OFC_WEBVIEW_URL,
      '_blank',
      `fullscreen=no,zoom=no,location=no${hidden}`
    );

    browser.on('loadstop').subscribe((event) => {
      console.log('stop', event);
      this.onStopLoad(browser, cookies);
    });
  }

  onStopLoad(browser, cookies) {
    browser.executeScript(
      {
        code: 'document.cookie',
      },
      (params) => {
        const inBrowserCookiesStr: string = params[0];
        if (!this.sessionExpired(inBrowserCookiesStr)) {
          browser.show();
          return;
        }
        this.ofcLoadTimes =
          !cookies && this.sessionExpired(inBrowserCookiesStr)
            ? 1
            : this.ofcLoadTimes;

        this.loadOFCCookies()
          .then((data) => {
            const cookiesSet = data.headers['set-cookie'];
            if (cookiesSet && cookiesSet !== '') {
              const cookies = cookiesSet.split(', _');
              this.setCookies(browser, cookies);
              this.ofcLoadTimes++;
              this.loadOFC(cookies);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    );
  }

  sessionExpired(inBrowserCookiesStr: string): boolean {
    if (!inBrowserCookiesStr || inBrowserCookiesStr === '') {
      return true;
    }

    const inBrowserCookiesArr = inBrowserCookiesStr.split(';');
    let expiresDateStr = inBrowserCookiesArr[1];
    if (!expiresDateStr) {
      return true;
    }

    expiresDateStr = expiresDateStr.substring(expiresDateStr.indexOf('=') + 1);
    let expiresDateObj = new Date(expiresDateStr);
    const nowDate = new Date();

    return expiresDateObj.getTime() <= nowDate.getTime();
  }

  setCookies(browser, cookies) {
    const cookie = cookies[0];
    const cookieName = cookie.split('=')[0];
    const cookieValue = cookie.substring(cookie.indexOf('=') + 1);
    const cookieValueArr = cookieValue.split(';');
    const cookieCode =
      'document.cookie="' + cookieName + '=' + cookieValueArr[0] + '";';
    browser.executeScript({
      code: cookieCode,
    });

    let expireDateStr = cookieValueArr[3];
    expireDateStr = expireDateStr.substring(expireDateStr.indexOf('=') + 1);
    const expiresDateCode =
      'document.cookie="expires_date=' + expireDateStr + '";';
    browser.executeScript({
      code: expiresDateCode,
    });
  }
}
