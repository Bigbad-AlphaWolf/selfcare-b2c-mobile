import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { OffreService } from 'src/app/models/offre-service.model';
import { DATA_OFFRES_SERVICES } from 'src/app/utils/data';
import { HTTP } from '@ionic-native/http/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

const ls = new SecureLS({ encodingType: 'aes' });

import {
  OFFRE_SERVICES_ENDPOINT,
  ALL_SERVICES_ENDPOINT,
} from '../utils/services.endpoints';
import * as SecureLS from 'secure-ls';
@Injectable({
  providedIn: 'root',
})
export class OperationService {
  offresServices: any[];
  static AllOffers: OffreService[] = [];
  constructor(
    private http: HttpClient,
    private httpNative: HTTP,
    private inAppBrowser: InAppBrowser
  ) {}

  initServicesData(codeFormule?: string) {
    let endpointOffresServices = OFFRE_SERVICES_ENDPOINT;
    if (codeFormule) {
      endpointOffresServices += `/${codeFormule}?typeResearch=FORMULE`;
    }
    return this.http.get(endpointOffresServices).pipe(
      map((r: any[]) => {
        this.offresServices = r;
      })
    );
  }

  sortByOrdre(arr: any[]) {
    return arr.sort((r1, r2) => r1.ordre - r2.ordre);
  }

  getAllServices() {
    return this.http.get(`${ALL_SERVICES_ENDPOINT}?page=0&size=100`);
  }

  loadOFCCookiestest() {
    this.httpNative.setServerTrustMode('nocheck');
    return this.httpNative.get(
      `https://webview.iaascore.com/?lang=fr`,
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
      `https://webview.iaascore.com/?lang=fr`,
      {},
      {
        Authorization: `Bearer ${token}`,
      }
    );
  }

  loadOFC() {
    this.loadOFCCookies()
      .then((data) => {
        const cookies = data.headers['set-cookie'].split(',');
        this.setInAppBrowserCookies(cookies);
      })
      .catch((error) => {
        console.log(error.status);
        console.log(error.error);
        console.log(error.headers);
      });
  }

  private setInAppBrowserCookies(cookies: string[]) {
    this.loadOFCWebview(cookies, true);
  }

  private loadOFCWebview(cookies: string[], setCookies = false) {
    const hidden = setCookies ? ',hidden=yes' : '';
    const browser = this.inAppBrowser.create(
      'https://webview.iaascore.com/?lang=fr',
      '_blank',
      `fullscreen=no,location=no${hidden}`
    );

    browser.on('loadstart').subscribe((event) => {
      console.log('load start ', event);
      cookies.forEach((cookie) => {
        const cookieName = cookie.split('=')[0];
        const cookieValue = cookie.substring(cookie.indexOf('=') + 1);
        browser.executeScript({
          code: `document.cookie="${cookieName}=${cookieValue}";`,
        });
      });
    });

    browser.on('loaderror').subscribe((event) => {
      console.log('load error ', event);
    });

    browser.on('beforeload').subscribe((event) => {
      console.log('beforeload ', event);
    });

    browser.on('loadstop').subscribe((event) => {
      console.log('stop', event);
      if (setCookies) {
        this.loadOFCWebview(cookies);
      }
    });
  }
}
