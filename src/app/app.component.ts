import { BuyCreditPage } from './buy-credit/buy-credit.page';
import { BuyPassIllimixPage } from './buy-pass-illimix/buy-pass-illimix.page';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { BuyPassInternetPage } from './buy-pass-internet/buy-pass-internet.page';
import { AssistancePage } from './assistance/assistance.page';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const { SERVICES_SERVICE, SERVER_API_URL } = environment;
import * as SecureLS from 'secure-ls';
import { DetailsConsoPage } from './details-conso/details-conso.page';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { UuidService } from './services/uuid-service/uuid.service';
import { v4 as uuidv4 } from 'uuid';
import { TransfertHubServicesPage } from './transfert-hub-services/transfert-hub-services.page';
import { ApplicationRoutingService } from './services/application-routing/application-routing.service';
import { checkUrlMatch } from './utils/utils';

const ls = new SecureLS({ encodingType: 'aes' });

declare var FollowAnalytics: any;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
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
    private appRout: ApplicationRoutingService
    ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize BackButton Eevent.
      if(this.platform && this.platform.backButton){
        this.platform.backButton.subscribe(() => {
          this.appMinimize.minimize();
        });

        if (this.platform.is('android')) {
          this.statusBar.backgroundColorByHexString('#FFFFFF');
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
        
        // if (this.platform.is('ios')) {
        //   if (typeof FollowAnalytics !== 'undefined') {
        //     FollowAnalytics.initialize('LV4mrGLUK4o2zQ');
        //     FollowAnalytics.registerForPush();
        //   }
        // } else if (this.platform.is('android')) {
        //   if (typeof FollowAnalytics !== 'undefined') {
        //     FollowAnalytics.initialize('DgD85nBBSi5wtw');
        //     FollowAnalytics.registerForPush();
        //   }
        // }
      }
      if(this.statusBar){
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
    if(this.deeplinks){
      this.deeplinks
        .route({
          '/buy-pass-internet': TransfertHubServicesPage,
          '/buy-pass-internet/:id': BuyPassInternetPage,
          '/assistance': AssistancePage,
          '/buy-pass-illimix': TransfertHubServicesPage,
          '/buy-pass-illimix/:id': BuyPassIllimixPage,
          '/buy-credit': TransfertHubServicesPage,
          '/details-conso': DetailsConsoPage,
        })
        .subscribe(
          (matched) => {
            this.goToPage(matched.$link.path)
            // this.router.navigate([matched.$link.path]);
            console.log(matched);

          },
          () => {
            // console.log(notMatched);
            // console.log('deeplink not matched');
          }
        );
    }
  }

  goToPage(path: string){
    if( checkUrlMatch(path) ){
      this.appRout.goToTransfertHubServicesPage('BUY');
    }else {
      this.router.navigate([path])
    }
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
  setUUidValue(){
    const x_uuid = ls.get('X-UUID');
    
    if(!x_uuid || x_uuid === ""){
      const uuidV4 = uuidv4();
      ls.set('X-UUID',uuidV4)
    }
  }
}
