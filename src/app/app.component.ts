import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Component} from '@angular/core';
import {LoadingController, ModalController, NavController, Platform, ToastController} from '@ionic/angular';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {Deeplinks} from '@ionic-native/deeplinks/ngx';
import {Router} from '@angular/router';
import * as SecureLS from 'secure-ls';
import {DetailsConsoPage} from './details-conso/details-conso.page';
import {v4 as uuidv4} from 'uuid';
import {TransfertHubServicesPage} from './transfert-hub-services/transfert-hub-services.page';
import {ApplicationRoutingService} from './services/application-routing/application-routing.service';
import {checkUrlMatch} from './utils/utils';
import {ImageLoaderConfigService} from 'ionic-image-loader';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
import {Uid} from '@ionic-native/uid/ngx';
import {DashboardPage} from './dashboard/dashboard.page';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {AssistanceHubPage} from './assistance-hub/assistance-hub.page';
import {ParrainagePage} from './parrainage/parrainage.page';
import {MyOfferPlansPage} from './pages/my-offer-plans/my-offer-plans.page';
import {Diagnostic} from '@ionic-native/diagnostic/ngx';
import {ContactsService} from './services/contacts-service/contacts.service';
import {OrangeMoneyService} from './services/orange-money-service/orange-money.service';
import {catchError, tap} from 'rxjs/operators';
import {AuthenticationService} from './services/authentication-service/authentication.service';
import {OtpService} from './services/otp-service/otp.service';
import {throwError} from 'rxjs';
import {NewRegistrationPage} from './new-registration/new-registration.page';
import {LocalStorageService} from './services/localStorage-service/local-storage.service';
import {LOCAL_STORAGE_KEYS, PATH_ACCESS_BY_OTP, STEPS_ACCESS_BY_OTP} from 'src/shared';
import {BottomSheetService} from './services/bottom-sheet/bottom-sheet.service';
import { FCM } from 'cordova-plugin-fcm-with-dependecy-updated/ionic/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { NotificationService } from './services/notification.service';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from 'src/environments/environment';
import { OperationRecapPage } from './operation-recap/operation-recap.page';
const { SERVER_API_URL } = environment;

const ls = new SecureLS({encodingType: 'aes'});

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
    private navContr: NavController,
    private diagnostic: Diagnostic,
    private contactService: ContactsService,
    private authServ: AuthenticationService,
    private loadingController: LoadingController,
    private otpService: OtpService,
    private localStorage: LocalStorageService,
    private bottomSheetServ: BottomSheetService,
    private fcm: FCM,
    private notificationService: NotificationService,
		private network: Network,
		private httpNative: HTTP,
		private toastController: ToastController
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
      (contactStatus) => {
        if (
          contactStatus === this.diagnostic.permissionStatus.GRANTED ||
          contactStatus === this.diagnostic.permissionStatus.GRANTED_WHEN_IN_USE
        ) {
          this.contactService.getAllContacts().subscribe();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async getVersion() {
    this.appVersion.getVersionNumber().then((version) => {
      this.appVersionNumber = version;
    });
  }

  setInfos() {
    const omNumber = this.orangeMoneyServ.getOrangeMoneyNumber();
    this.omUserInfos = this.orangeMoneyServ.GetOrangeMoneyUser(omNumber);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Initialize BackButton Eevent.
      this.loadContacts();
      this.getVersion();
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
      this.setupFCMNotifications()
    });
  }

  async setupFCMNotifications() {
    this.fcm.onNotification().subscribe((data) => {
      console.log('received', data);
      if (data.wasTapped) {
        console.log('Received in background');
      } else {
        console.log('Received in foreground');
      }
      this.notificationService.handleNotification(data);
    });
    // Get firebase id for notifications
    this.fcm
      .getToken()
      .then((token) => {
        console.log('Your FIREBASE TOKEN', token);
      })
      .catch((err) => console.log('error setting firebase', err));
  }

  checkDeeplinks() {
    this.deeplinks
      .route({
        '/buy-pass-internet': TransfertHubServicesPage,
        '/pass-internet/:ppi': TransfertHubServicesPage,
        '/assistance': AssistanceHubPage,
        '/buy-pass-illimix': TransfertHubServicesPage,
        '/pass-illimix/:ppi': TransfertHubServicesPage,
        '/buy-credit': TransfertHubServicesPage,
        '/details-conso': DetailsConsoPage,
        '/suivi-conso': DashboardPage,
        '/transfer-money/:msisdn/:amount': TransfertHubServicesPage,
        '/transfer-money/:msisdn': TransfertHubServicesPage,
        '/transfer-money': TransfertHubServicesPage,
        '/soscredit/:amount': '',
        '/soscredit': '',
        '/sospass/:amount': '',
        '/sospass': '',
        '/illiflex': TransfertHubServicesPage,
        '/parrainage': ParrainagePage,
        '/bonplan': MyOfferPlansPage,
        '/access/:hmac': NewRegistrationPage,
        '/changement-formule/:codeFormule': TransfertHubServicesPage,
        '/changement-formule': TransfertHubServicesPage,
        '/payer-sonatel': TransfertHubServicesPage,
        '/payer-teranga': TransfertHubServicesPage,
        '/payer-sonatel/:msisdn': TransfertHubServicesPage,
        '/payer-teranga/:msisdn': TransfertHubServicesPage,
        '/pass-internet': OperationRecapPage,
        '/pass-illimix': OperationRecapPage,
        '/login': TransfertHubServicesPage
      })
      .subscribe(
        (matched) => {
          const path = matched.$link.path
            ? matched.$link.path
            : matched.$link.host;
          const isAccessByOTPPath = (path + '').includes(PATH_ACCESS_BY_OTP);
          if (isAccessByOTPPath) {
            this.processAccessByOtp(path);
          } else {
            this.goToPage(path, matched?.$args);
          }
          // this.router.navigate([matched.$link.path]);
          console.log(matched);
        },
        (err) => {
           console.log('notMatched', err);
          // console.log('deeplink not matched');
        }
      );
  }

  goToPage(path: string, options?: any) {
    if (checkUrlMatch(path)) {
      this.appRout.goToTransfertHubServicesPage('BUY');
    } else {
      this.router.navigate([path], {
				state: options
			});
    }
  }

  async processAccessByOtp(path: string) {
    const hmac_hashe =
      path.split(PATH_ACCESS_BY_OTP).length === 2
        ? path.split(PATH_ACCESS_BY_OTP)[1]
        : '';
    const userHasLogin = !!this.authServ.getToken();

    if (!userHasLogin) {
      const optAccessUserNumber = this.localStorage.getFromLocalStorage(
        LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION
      );
      const loader = await this.presentLoadingWithOptions();
      loader.present();
      this.otpService
        .checkOTPSMS({ hmac: hmac_hashe })
        .pipe(
          tap((res: { hmac: string; check: boolean }) => {
            loader.dismiss();
            this.bottomSheetServ.enterUserPhoneNumber(
              optAccessUserNumber,
              STEPS_ACCESS_BY_OTP.PROCESS_OTP,
              !res.check
            );
          }),
          catchError((err) => {
            loader.dismiss();
            this.bottomSheetServ.enterUserPhoneNumber(
              optAccessUserNumber,
              STEPS_ACCESS_BY_OTP.PROCESS_OTP,
              true
            );

            return throwError(err);
          })
        )
        .subscribe();
    }
  }

  async getImei() {
    console.log(this.uid);
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );
    if (!hasPermission) {
      console.log('hasPermission', hasPermission);

      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );
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
		this.network.onChange().subscribe(async (res) => {
			let	hasResponse = false;
			this.httpNative.setServerTrustMode('nocheck');
			if(res === 'disconnected') {
				toast.present();
			} else {
				const timeOutID = setTimeout(async () => {
					if(!hasResponse) {
						toast.present();
					}
				}, 5000)
					this.httpNative.get(`${SERVER_API_URL}`, null, null).then(async () => {
						hasResponse = true;
						clearTimeout(timeOutID);
						toast.dismiss();
					}).catch(async (err) => {
						console.log('err', err);
						hasResponse = true;
						clearTimeout(timeOutID);
						toast.present();
					})

			}
		})
	}

	createToastErrorMsg() {
    return this.toastController.create({
      header: 'Votre connexion internet n’est pas activée',
      message: "Veuillez-vous connecter pour avoir vos données à jour et effectuer des transactions.",
      position: 'top'
    });
  }

}
