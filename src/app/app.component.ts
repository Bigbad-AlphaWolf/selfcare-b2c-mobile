import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Component} from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {Router} from '@angular/router';
import * as SecureLS from 'secure-ls';
import {DetailsConsoPage} from './details-conso/details-conso.page';
import {AppMinimize} from '@ionic-native/app-minimize/ngx';
import {v4 as uuidv4} from 'uuid';
import {TransfertHubServicesPage} from './transfert-hub-services/transfert-hub-services.page';
import {ApplicationRoutingService} from './services/application-routing/application-routing.service';
import {checkUrlMatch} from './utils/utils';
import {ImageLoaderConfigService} from 'ionic-image-loader';
import {HttpHeaders} from '@angular/common/http';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Uid} from '@ionic-native/uid/ngx';
import {DashboardPage} from './dashboard/dashboard.page';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {AssistanceHubPage} from './assistance-hub/assistance-hub.page';
import {ParrainagePage} from './parrainage/parrainage.page';
import {MyOfferPlansPage} from './pages/my-offer-plans/my-offer-plans.page';
import {OrangeMoneyService} from './services/orange-money-service/orange-money.service';

const ls = new SecureLS({encodingType: 'aes'});

declare var FollowAnalytics: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  appVersionNumber: any;
  isIOS = false;
  appId: string;
  static IMEI: string;
  omUserInfos: any;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splash: SplashScreen,
    private orangeMoneyServ: OrangeMoneyService,
    private router: Router,
    private deeplinks: Deeplinks,
    private appRout: ApplicationRoutingService,
    private imageLoaderConfig: ImageLoaderConfigService,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private appVersion: AppVersion,
    private navContr: NavController
  ) {
    this.getVersion();
    this.imageLoaderConfig.enableSpinner(false);
    // this could be useful while trying to debug issues with the component
    this.imageLoaderConfig.enableDebugMode();
    const token = ls.get('token');
    const headers = new HttpHeaders();
    // .set("Authorization", `Bearer ${token}`);
    // headers.set( 'Access-Control-Allow-Origin','*');
    // headers.set('Access-Control-Allow-Methods','GET, POST, PATCH, PUT, DELETE, OPTIONS')
    // headers.set('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token, Accept')
    // headers.set('Accept','image/avif,image/webp,image/apng,image/*,*/*;q=0.8')
    // headers.set('sec-fetch-mode','no-cors')
    // headers.set(':authority','orangeetmoi.orange.sn')

    this.imageLoaderConfig.setHttpHeaders(headers);

    this.initializeApp();
  }

  async getVersion() {
    this.appVersion.getVersionNumber().then(version => {
      this.appVersionNumber = version;
    });
  }

  setInfos(event: any) {
    const omNumber = this.orangeMoneyServ.getOrangeMoneyNumber();
    this.omUserInfos = this.orangeMoneyServ.GetOrangeMoneyUser(omNumber);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize BackButton Eevent.
      this.getVersion();
      if (this.platform && this.platform.backButton) {
        this.platform.backButton.subscribe(() => {
          this.navContr.pop();
        });

        if (this.platform.is('android')) {
          this.statusBar.backgroundColorByHexString('#FFFFFF');
          this.getImei();
          //getPermission is for getting the IMEI
          //this.getPermission();getPermission() {
          //   this.androidPermissions
          //     .checkPermission(this.androidPermissions.PERMISSION.READ_PRIVILEGED_PHONE_STATE)
          //     .then((res) => {
          //       if (res.hasPermission) {
          //       } else {
          //         this.androidPermissions
          //           .requestPermission(
          //             this.androidPermissions.PERMISSION.READ_PRIVILEGED_PHONE_STATE
          //           )
          //           .then((res) => {
          //             // console.log('Persmission Granted!');
          //           })
          //           .catch((error) => {
          //             // console.log('Error! ' + error);
          //           });
          //       }
          //     })
          //     .catch((error) => {
          //       console.log('Error! ' + error);
          //     });
          // }

          // getID_UID(type) {
          //   if (type === 'IMEI') {
          //     return this.uid.IMEI;
          //   } else if (type === 'ICCID') {
          //     return this.uid.ICCID;
          //   } else if (type === 'IMSI') {
          //     return this.uid.IMSI;
          //   } else if (type === 'MAC') {
          //     return this.uid.MAC;
          //   } else if (type === 'UUID') {
          //     return this.uid.UUID;
          //   }
          // }
        }
      }
      if (this.statusBar) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleDefault();
      }
      // #AARRGGBB where AA is an alpha value RR is red, GG is green and BB is blue

      this.splash.hide();

      this.checkDeeplinks();
      this.setUUidValue();
      // Get firebase id for notifications
      // this.fcm
      //   .getToken()
      //   .then(token => {
      //     ls.set('firebaseId', token);
      //     // console.log(token);
      //   })
      //   .catch(err => console.log(err));

      // if (this.platform.is('ios')) {
      //   this.fcm
      //     .hasPermission()
      //     .then(hasPermission =>
      //       console.log(hasPermission ? 'notification permission granted' : 'notification permission denied')
      //     );
      // }

      // this.fcm
      //   .onNotification()
      //   .subscribe(data => {
      //     // console.log(data);
      //     if (data.wasTapped) {
      //       console.log('Notification received in background');
      //     } else {
      //       console.log('Notification received in foreground');
      //     }
      //   });

      // this.fcm.onTokenRefresh().subscribe(fcmToken => {
      //   //console.log(fcmToken);
      //   ls.set('firebaseId', fcmToken);
      // });
    });
  }

  checkDeeplinks() {
    this.deeplinks
      .routeWithNavController(this.navContr, {
        '/buy-pass-internet': TransfertHubServicesPage,
        //'/pass-internet/:ppi': BuyPassInternetPage,
        '/assistance': AssistanceHubPage,
        '/buy-pass-illimix': TransfertHubServicesPage,
        //'/pass-illimix/:ppi': BuyPassIllimixPage,
        '/buy-credit': TransfertHubServicesPage,
        '/details-conso': DetailsConsoPage,
        '/suivi-conso': DashboardPage,
        '/transfer-money/:msisdn/:amount': TransfertHubServicesPage,
        '/transfer-money/:msisdn': TransfertHubServicesPage,
        '/soscredit/:amount': '',
        '/sospass/:amount': '',
        '/illiflex': TransfertHubServicesPage,
        '/parrainage': ParrainagePage,
        '/bonplan': MyOfferPlansPage
      })
      .subscribe(
        matched => {
          const path = matched.$link.path ? matched.$link.path : matched.$link.host;
          this.goToPage(path);
          // this.router.navigate([matched.$link.path]);
          console.log(matched);
        },
        () => {
          // console.log(notMatched);
          // console.log('deeplink not matched');
        }
      );
  }

  goToPage(path: string) {
    if (checkUrlMatch(path)) {
      this.appRout.goToTransfertHubServicesPage('BUY');
    } else {
      this.router.navigate([path]);
    }
  }

  async getImei() {
    console.log(this.uid);
    const {hasPermission} = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE);
    if (!hasPermission) {
      console.log('hasPermission', hasPermission);

      const result = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE);
      if (!result.hasPermission) {
        console.log('hasPermission2', hasPermission);
        throw new Error('Permissions required');
      }
      return;
    }
    const imei = this.uid.IMEI;
    AppComponent.IMEI = imei;
    return imei;
  }

  // getPermission() {
  //   this.androidPermissions
  //     .checkPermission(this.androidPermissions.PERMISSION.READ_PRIVILEGED_PHONE_STATE)
  //     .then((res) => {
  //       if (res.hasPermission) {
  //       } else {
  //         this.androidPermissions
  //           .requestPermission(
  //             this.androidPermissions.PERMISSION.READ_PRIVILEGED_PHONE_STATE
  //           )
  //           .then((res) => {
  //             // console.log('Persmission Granted!');
  //           })
  //           .catch((error) => {
  //             // console.log('Error! ' + error);
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       console.log('Error! ' + error);
  //     });
  // }

  // getID_UID(type) {
  //   if (type === 'IMEI') {
  //     return this.uid.IMEI;
  //   } else if (type === 'ICCID') {
  //     return this.uid.ICCID;
  //   } else if (type === 'IMSI') {
  //     return this.uid.IMSI;
  //   } else if (type === 'MAC') {
  //     return this.uid.MAC;
  //   } else if (type === 'UUID') {
  //     return this.uid.UUID;
  //   }
  // }

  setUUidValue() {
    const x_uuid = ls.get('X-UUID');
    if (!x_uuid || x_uuid === '') {
      const uuidV4 = uuidv4();
      ls.set('X-UUID', uuidV4);
    }
  }
}
