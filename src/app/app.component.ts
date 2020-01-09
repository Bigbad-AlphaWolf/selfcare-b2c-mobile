import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { LoginPage } from './login/login.page';

declare var FollowAnalytics: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splash: SplashScreen,
    private appMinimize: AppMinimize,
    private deeplinks: Deeplinks
  ) {
    this.initializeApp();
    // Initialize BackButton Eevent.
    this.platform.backButton.subscribe(() => {
      this.appMinimize.minimize();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      // #AARRGGBB where AA is an alpha value RR is red, GG is green and BB is blue
      this.statusBar.backgroundColorByHexString('#FFFFFF');
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
    });
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.deeplinks.route({ '/login': LoginPage }).subscribe(
        matched => {
          console.log('deeplink matched');
        },
        notMatched => {
          console.log('deeplink not matched');
        }
      );
    });
  }
}
