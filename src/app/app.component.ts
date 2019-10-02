import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
declare var FollowAnalytics: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      // #AARRGGBB where AA is an alpha value RR is red, GG is green and BB is blue
      this.statusBar.backgroundColorByHexString('#FFFFFF');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (this.platform.is('ios')) {
        if (typeof FollowAnalytics !== 'undefined') {
        FollowAnalytics.initialize('QPffEkR8XKf7Yg', true);
        FollowAnalytics.registerForPush();
        }
      } else if (this.platform.is('android')) {
        if (typeof FollowAnalytics !== 'undefined') {
        console.log(FollowAnalytics);
        FollowAnalytics.initialize('uhIEz_moLxM4nw', true);
        FollowAnalytics.registerForPush();
        }
      }
    });
  }
}
