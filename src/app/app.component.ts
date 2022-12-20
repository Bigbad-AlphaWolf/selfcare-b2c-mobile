import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component, NgZone } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationRoutingService } from './services/application-routing/application-routing.service';
import { checkUrlMatch } from './utils/utils';
import { ImageLoaderConfigService } from 'ionic-image-loader';
import { HttpHeaders } from '@angular/common/http';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AssistanceHubPage } from './assistance-hub/assistance-hub.page';
import { BatchAnalyticsService } from './services/batch-analytics/batch-analytics.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { ContactsService } from './services/contacts-service/contacts.service';
import { OrangeMoneyService } from './services/orange-money-service/orange-money.service';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from './services/authentication-service/authentication.service';
import { OtpService } from './services/otp-service/otp.service';
import { throwError } from 'rxjs';
import { LocalStorageService } from './services/localStorage-service/local-storage.service';
import { LOCAL_STORAGE_KEYS, PATH_ACCESS_BY_OTP, STEPS_ACCESS_BY_OTP } from 'src/shared';
import { BottomSheetService } from './services/bottom-sheet/bottom-sheet.service';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NotificationService } from './services/notification.service';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { FirebaseDynamicLinks } from '@awesome-cordova-plugins/firebase-dynamic-links/ngx';
import { BonsPlansSargalService } from './services/bons-plans-sargal/bons-plans-sargal.service';
import { DashboardService } from './services/dashboard-service/dashboard.service';
import { EyesonSdkService } from './services/eyeson-service/eyeson-sdk.service';

const { SERVER_API_URL } = environment;

const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  appVersionNumber: any;
  isIOS = false;
  appId: string;
  static IMEI: string;
  omUserInfos: any;
  showBonPlanSargal: boolean;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splash: SplashScreen,
    private orangeMoneyServ: OrangeMoneyService,
    private router: Router,
    private appRout: ApplicationRoutingService,
    private imageLoaderConfig: ImageLoaderConfigService,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    private appVersion: AppVersion,
    private navContr: NavController,
    private batch: BatchAnalyticsService,
    private diagnostic: Diagnostic,
    private contactService: ContactsService,
    private authServ: AuthenticationService,
    private loadingController: LoadingController,
    private otpService: OtpService,
    private localStorage: LocalStorageService,
    private bottomSheetServ: BottomSheetService,
    private network: Network,
    private httpNative: HTTP,
    private toastController: ToastController,
    private firebaseDynamicLinks: FirebaseDynamicLinks,
    private bpSargalService: BonsPlansSargalService,
    private notificationService: NotificationService,
    private ngZone: NgZone,
    private dashbService: DashboardService,
    private sdkEyesOn: EyesonSdkService
  ) {
    this.getVersion();
    this.imageLoaderConfig.enableSpinner(false);
    // this could be useful while trying to debug issues with the component
    this.imageLoaderConfig.enableDebugMode();
    const headers = new HttpHeaders();
    this.imageLoaderConfig.setHttpHeaders(headers);
    this.initializeApp();
    this.checkNetworkAccess();
  }

  loadContacts() {
    this.diagnostic.getContactsAuthorizationStatus().then(
      contactStatus => {
        if (contactStatus === this.diagnostic.permissionStatus.GRANTED || contactStatus === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE) {
          this.contactService.getAllContacts().subscribe();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  async getVersion() {
    this.appVersion.getVersionNumber().then(version => {
      this.appVersionNumber = version;
    });
  }

  setInfosForSidemenu() {
    const omNumber = this.orangeMoneyServ.getOrangeMoneyNumber();
    this.omUserInfos = this.orangeMoneyServ.GetOrangeMoneyUser(omNumber);
    this.getBonsPlansSargal();
  }

  getBonsPlansSargal() {
    this.bpSargalService
      .getBonsPlansSargal()
      .pipe(
        tap(bonPlanResponse => {
          this.showBonPlanSargal = !!bonPlanResponse?.length;
        })
      )
      .subscribe();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize BackButton Eevent.
      this.loadContacts();
      this.getVersion();
      this.batch.initBatchConfig(this.platform.is('ios'));
      this.listenNotifications();
      if (this.platform && this.platform.backButton) {
        this.platform.backButton.subscribe(() => {
          this.navContr.pop();
        });

        if (this.platform.is('android')) {
          this.statusBar.backgroundColorByHexString('#FFFFFF');
          this.getImei();
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
      this.setupFCMNotifications();
    });
  }

  listenNotifications() {
    document.addEventListener('batchPushReceived', notification => {
      this.notificationService.handleNotification(notification);
    });
  }

  async setupFCMNotifications() {
    const userHasLogin = !!this.authServ.getToken();
    if (userHasLogin) {
      this.authServ.setUserFirebaseId(this.dashbService.getMainPhoneNumber()).subscribe();
    }
    //this.fcm.onNotification().subscribe((data) => {
    //  console.log('received', data);
    //  if (data.wasTapped) {
    //    console.log('Received in background');
    //  } else {
    //    console.log('Received in foreground');
    //  }
    //  this.notificationService.handleNotification(data);
    //});
    //// Get firebase id for notifications
    //this.fcm
    //  .getToken()
    //  .then((token) => {
    //    console.log('Your FIREBASE TOKEN', token);
    //  })
    //  .catch((err) => console.log('error setting firebase', err));
  }

  checkDeeplinks() {
    this.firebaseDynamicLinks.onDynamicLink().subscribe(
      (res: any) => {
        const result: { deepLink: string; minimumAppVersion: number } = res;
        if (result?.deepLink) {
          const path = result?.deepLink.replace('https://myorangesn.page.link', '');
          this.ngZone.run(() => {
            this.goToPage(path);
          });
          console.log('res onDynamicLink', path);
        }
        console.log(res);
      },
      (error: any) => {
        console.log('error onDynamicLink');
        console.log(error);
      }
    );
  }

  goToPage(path: string, options?: any) {
    if (checkUrlMatch(path)) {
      console.log('path', path);
      this.appRout.goToTransfertHubServicesPage('BUY');
    } else {
      this.router.navigate([path], {
        state: options,
      });
    }
  }

  async processAccessByOtp(path: string) {
    const hmac_hashe = path.split(PATH_ACCESS_BY_OTP).length === 2 ? path.split(PATH_ACCESS_BY_OTP)[1] : '';
    const userHasLogin = !!this.authServ.getToken();

    if (!userHasLogin) {
      const optAccessUserNumber = this.localStorage.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION);
      const loader = await this.presentLoadingWithOptions();
      loader.present();
      this.otpService
        .checkOTPSMS({ hmac: hmac_hashe })
        .pipe(
          tap((res: { hmac: string; check: boolean }) => {
            loader.dismiss();
            this.bottomSheetServ.enterUserPhoneNumber(optAccessUserNumber, STEPS_ACCESS_BY_OTP.PROCESS_OTP, !res.check);
          }),
          catchError(err => {
            loader.dismiss();
            this.bottomSheetServ.enterUserPhoneNumber(optAccessUserNumber, STEPS_ACCESS_BY_OTP.PROCESS_OTP, true);

            return throwError(err);
          })
        )
        .subscribe();
    }
  }

  async getImei() {
    console.log(this.uid);
    const { hasPermission } = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE);
    if (!hasPermission) {
      console.log('hasPermission', hasPermission);

      const result = await this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE);
      if (!result.hasPermission) {
        console.log('hasPermission2', hasPermission);
        throw new Error('Permissions required');
      }
    }
    //this.initAndStartEyesOnPlugin(this.platform.is('android'));
    const imei = this.uid.IMEI;
    AppComponent.IMEI = imei;
    return imei;
  }

  setUUidValue() {
    const x_uuid = ls.get('X-UUID');
    if (!x_uuid || x_uuid === '') {
      const uuidV4 = uuidv4();
      ls.set('X-UUID', uuidV4);
    }
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      message: 'Veuillez patienter',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: false,
    });
    return loading;
  }

  async checkNetworkAccess() {
    let toast = await this.createToastErrorMsg();
    this.network.onChange().subscribe(async res => {
      let hasResponse = false;
      this.httpNative.setServerTrustMode('nocheck');
      if (res === 'disconnected') {
        toast.present();
      } else {
        const timeOutID = setTimeout(async () => {
          if (!hasResponse) {
            toast.present();
          }
        }, 5000);
        this.httpNative
          .get(`${SERVER_API_URL}`, null, null)
          .then(async () => {
            hasResponse = true;
            clearTimeout(timeOutID);
            toast.dismiss();
          })
          .catch(async err => {
            console.log('err', err);
            hasResponse = true;
            clearTimeout(timeOutID);
            toast.present();
          });
      }
    });
  }

  createToastErrorMsg() {
    return this.toastController.create({
      header: 'Votre connexion internet n’est pas activée',
      message: 'Veuillez-vous connecter pour avoir vos données à jour et effectuer des transactions.',
      position: 'top',
    });
  }

  //async initAndStartEyesOnPlugin(isAndroid: boolean) {
  //  if (isAndroid) {
  //    console.log('called EyesOn');
  //    this.sdkEyesOn.initAgent().then(res => {
  //      console.log('init', res);
  //      this.sdkEyesOn.startAgent().then(res => {
  //        console.log('start', res);
  //        this.sdkEyesOn.onUpdatePermissions().then(res => {
  //          console.log('onUpdatePermissions', res);
  //        });
  //      });
  //    });
  //  }
  //}
}
