import { MatDialog } from '@angular/material';
import { BuyCreditPage } from './buy-credit/buy-credit.page';
import { BuyPassIllimixPage } from './buy-pass-illimix/buy-pass-illimix.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { LoginPage } from './login/login.page';
import { BuyPassInternetPage } from './buy-pass-internet/buy-pass-internet.page';
import { AssistancePage } from './assistance/assistance.page';
import { Router } from '@angular/router';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { CancelOperationPopupComponent } from 'src/shared/cancel-operation-popup/cancel-operation-popup.component';
import { BuyCreditPage } from './buy-credit/buy-credit.page';
import { BuyPassIllimixPage } from './buy-pass-illimix/buy-pass-illimix.page';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { isNewVersion } from 'src/shared';
import { AppVersion } from '@ionic-native/app-version/ngx';
const { SERVICES_SERVICE, SERVER_API_URL } = environment;
const versionEndpoint = `${SERVER_API_URL}/${SERVICES_SERVICE}/api/v1/app-version`;

declare var FollowAnalytics: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  AppVersionNumber: any;
  isIOS = false;
  appId: string;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splash: SplashScreen,
    private router: Router,
    private http: HttpClient,
    private deeplinks: Deeplinks,
    private appVersion: AppVersion,
    private dialog: MatDialog,
    private firebaseX: FirebaseX
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      // #AARRGGBB where AA is an alpha value RR is red, GG is green and BB is blue
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#FFFFFF');
      }
      this.statusBar.styleDefault();

      this.splash.hide();

      if (this.platform.is('ios')) {
        this.isIOS = true;
        this.appId = 'orange-et-moi-sénégal/id1039327980';
        if (typeof FollowAnalytics !== 'undefined') {
          FollowAnalytics.initialize('LV4mrGLUK4o2zQ');
          FollowAnalytics.registerForPush();
        }
      } else if (this.platform.is('android')) {
        this.appId = 'com.orange.myorange.osn';
        if (typeof FollowAnalytics !== 'undefined') {
          FollowAnalytics.initialize('DgD85nBBSi5wtw');
          FollowAnalytics.registerForPush();
        }
      }
      this.checkDeeplinks();

      this.firebaseX
        .getToken()
        .then(token => console.log('PUSH_TOKEN: GET_TOKEN: ', token))
        .catch(err => console.log(err));

      if (this.platform.is('ios')) {
        this.firebaseX
          .grantPermission()
          .then(hasPermission =>
            console.log(hasPermission ? 'granted' : 'denied')
          );

        this.firebaseX
          .onApnsTokenReceived()
          .subscribe(token => console.log('PUSH_TOKEN: IOS_TOKEN: ' + token));
      }

      this.firebaseX
        .onMessageReceived()
        .subscribe(message => console.log(message));

      this.firebaseX.onTokenRefresh().subscribe(fcmToken => {
        console.log(fcmToken);
      });
    });
  }

  checkDeeplinks() {
    this.deeplinks
      .route({
        '/buy-pass-internet': BuyPassInternetPage,
        '/buy-pass-internet/:id': BuyPassInternetPage,
        '/assistance': AssistancePage,
        '/buy-pass-illimix': BuyPassIllimixPage,
        '/buy-pass-illimix/:id': BuyPassIllimixPage,
        '/buy-credit': BuyCreditPage
      })
      .subscribe(
        matched => {
          this.router.navigate([matched.$link.path]);
          // console.log('deeplink matched');
          // console.log(matched);
        },
        notMatched => {
          // console.log(notMatched);
          // console.log('deeplink not matched');
        }
      );
  }
}
