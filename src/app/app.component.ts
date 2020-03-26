import { AuthenticationService } from './services/authentication-service/authentication.service';
import { MatDialog } from '@angular/material';
import { BuyCreditPage } from './buy-credit/buy-credit.page';
import { BuyPassIllimixPage } from './buy-pass-illimix/buy-pass-illimix.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BuyPassInternetPage } from './buy-pass-internet/buy-pass-internet.page';
import { AssistancePage } from './assistance/assistance.page';
import { Router } from '@angular/router';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version/ngx';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });

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
    private appMinimize: AppMinimize,
    private router: Router,
    private deeplinks: Deeplinks,
    private firebaseX: FirebaseX
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize BackButton Eevent.
      this.platform.backButton.subscribe(() => {
        this.appMinimize.minimize();
      });
      this.statusBar.overlaysWebView(false);
      // #AARRGGBB where AA is an alpha value RR is red, GG is green and BB is blue
      if (this.platform.is('android')) {
        this.statusBar.backgroundColorByHexString('#FFFFFF');
      }
      this.statusBar.styleDefault();

      this.splash.hide();

      if (this.platform.is('ios')) {
        if (typeof FollowAnalytics !== 'undefined') {
          FollowAnalytics.initialize('LV4mrGLUK4o2zQ');
          FollowAnalytics.registerForPush();
        }
      } else if (this.platform.is('android')) {
        if (typeof FollowAnalytics !== 'undefined') {
          FollowAnalytics.initialize('DgD85nBBSi5wtw');
          FollowAnalytics.registerForPush();
        }
      }
      this.checkDeeplinks();

      // Get firebase id for notifications
      this.firebaseX
        .getToken()
        .then(token => {
          ls.set('firebaseId', token);
          console.log(token);
        })
        .catch(err => console.log(err));

      if (this.platform.is('ios')) {
        this.firebaseX
          .grantPermission()
          .then(hasPermission =>
            console.log(hasPermission ? 'granted' : 'denied')
          );

        this.firebaseX
          .onApnsTokenReceived()
          .subscribe(token => ls.set('firebaseId', token));
      }

      this.firebaseX
        .onMessageReceived()
        .subscribe(message => console.log(message));

      this.firebaseX.onTokenRefresh().subscribe(fcmToken => {
        console.log(fcmToken);
        ls.set('firebaseId', fcmToken);
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
        },
        notMatched => {
          // console.log(notMatched);
          // console.log('deeplink not matched');
        }
      );
  }
}
