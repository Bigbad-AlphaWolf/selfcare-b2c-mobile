import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  OnDestroy,
} from '@angular/core';
import { Subscription, timer, Subject, of, throwError } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccountStatus,
  AuthenticationService,
  ConfirmMsisdnModel,
  RegistrationModel,
} from '../services/authentication-service/authentication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as SecureLS from 'secure-ls';
import { CguPopupComponent } from 'src/shared/cgu-popup/cgu-popup.component';
const ls = new SecureLS({ encodingType: 'aes' });
import { SettingsPopupComponent } from 'src/shared/settings-popup/settings-popup.component';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import {
  takeUntil,
  finalize,
  catchError,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  HelpModalDefaultContent,
  PRO_MOBILE_ERROR_CODE,
  REGISTRATION_PASSWORD_STEP,
  FORGOT_PWD_PAGE_URL,
	LOCAL_STORAGE_KEYS,
} from 'src/shared';
import { CommonIssuesComponent } from 'src/shared/common-issues/common-issues.component';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { RegistrationSuccessModalPage } from '../registration-success-modal/registration-success-modal.page';
import { hash53 } from '../dashboard';
import { Uid } from '@ionic-native/uid/ngx';
import { Network } from '@ionic-native/network/ngx';
import { MSISDN_RECUPERATION_TIMEOUT } from '../register';
import { MsisdnAssistanceModalComponent } from './components/msisdn-assistance-modal/msisdn-assistance-modal.component';
import { TypePhoneNumberManuallyComponent } from './components/type-phone-number-manually/type-phone-number-manually.component';
import { LocalStorageService } from '../services/localStorage-service/local-storage.service';
import { OtpService } from '../services/otp-service/otp.service';
import { CheckOtpOem } from '../models/check-otp-oem.model';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.page.html',
  styleUrls: ['./new-registration.page.scss'],
})
export class NewRegistrationPage implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<SettingsPopupComponent, any>;
  dialogSub: Subscription;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  formPassword: FormGroup;
  checkNumberSubscription: Subscription;
  checkingNumber: boolean;
  creatingAccount: boolean;
  gettingNumber: boolean;
  numberGot: boolean;
  isLogging: boolean;
  showErrMessage: boolean;
  errorMsg: string;
  hmac: string;
  step: 'CHECK_NUMBER' | 'PASSWORD';
  fields = {
    password: { fieldType: 'password', visibilityIcon: 'visibility' },
    confirmPassword: { fieldType: 'password', visibilityIcon: 'visibility' },
  };
  navItems: {
    title: string;
    subTitle: string;
    action: 'help' | 'login' | 'password' | 'register';
  }[] = [];
  //Temps d'attente pour la recuperation automatique du numero -> 10 secondes
  MSISDN_RECUPERATION_TIMEOUT = MSISDN_RECUPERATION_TIMEOUT;
  authErrorDetected = new Subject<any>();
  helpNeeded = new Subject<any>();
  firstCallMsisdn: string;
  isNumberAttachedError: boolean;
  newtworkSubscription: Subscription;
  isResetPasswordAction: boolean;
	hideRefresh: boolean;
	isHmacValid: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private followAnalyticsService: FollowAnalyticsService,
    private modalController: ModalController,
    private navController: NavController,
    private ngZone: NgZone,
    private uid: Uid,
    private network: Network,
		private route: ActivatedRoute,
		private localServ: LocalStorageService,
		private otpService: OtpService,
		public platform: Platform
  ) {
    this.authErrorDetected.subscribe({
      next: () => {
        this.ngZone.run(() => {
          // this.openHelpModal(HelpModalDefaultContent);
        });
      },
    });
    this.helpNeeded.subscribe({
      next: (data) => {
        // this.openHelpModal(data);
      },
    });
  }

  ngOnDestroy() {
    if (this.newtworkSubscription) {
      this.newtworkSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
		if (this.router.url.match(FORGOT_PWD_PAGE_URL)) {
			this.isResetPasswordAction = true;
		}
		const step = history.state.step;
		if (step === REGISTRATION_PASSWORD_STEP) {
			this.step = 'PASSWORD';
		}
		const fromOTPMsg = history.state.fromOTPSMS;

		if(fromOTPMsg) {
			OtpService.isChecking.asObservable().subscribe(
				(res: boolean) => {
					this.hmac = this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.HMAC_FROM_OTP);
					this.phoneNumber = this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION);
					this.hideRefresh = true;
					this.showErrMessage = false;
					this.numberGot = true;
				}
			)
		}
		this.platform.resume.subscribe(
			(res) => {
				OtpService.isChecking.asObservable().subscribe((isChecking: boolean) => {

					if(!isChecking && !this.numberGot) {
						if(this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION) && this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.IS_HMAC_FROM_OTP_VALID)) {
								this.hmac = this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.HMAC_FROM_OTP);
								this.phoneNumber =  '221'+this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION);
								this.hideRefresh = true;
								this.showErrMessage = false;
								this.numberGot = true;

						} else if(this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION) && !this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.IS_HMAC_FROM_OTP_VALID) ) {
								console.log('isCheking', isChecking);
								this.errorMsg = 'Désolé, le lien a expiré. Veuillez renvoyer un autre SMS';
								this.phoneNumber = null;
								this.showErrMessage = true;
								this.numberGot = false;
						}

					}
				})
			}
		)
  }

  goIntro() {
    this.followAnalyticsService.registerEventFollow(
      'Voir_Intro',
      'event',
      'clic'
    );
    this.navController.navigateRoot(FORGOT_PWD_PAGE_URL);
  }

  ngOnInit() {
    this.step = 'CHECK_NUMBER';
    this.formPassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
		const accessFromOTP = history.state.fromOTPSMS;
		if(!accessFromOTP){
			this.getNumber();
			this.hideRefresh = false;
		};
  }

  getNumber() {
    const startTime = Date.now();
    this.gettingNumber = true;
    this.showErrMessage = false;
    this.isNumberAttachedError = false;
    if (!this.ref['destroyed']) this.ref.detectChanges();
    this.authServ
      .getMsisdnByNetwork()
      //if after msisdnTimeout milliseconds the call does not complete, stop it.
      .pipe(
        takeUntil(timer(MSISDN_RECUPERATION_TIMEOUT)),
        // finalize to detect whenever call is complete or terminated
        finalize(() => {
          // this.displayMsisdnError();
          if (!this.firstCallMsisdn && !this.showErrMessage) {
            //this.handleGetMsisdnError();
            this.displayMsisdnError();
            // this.authErrorDetected.next(HelpModalAuthErrorContent);
            // console.log('http call is not successful');
          }
        }),
        switchMap((res: { msisdn: string }) => {
          this.firstCallMsisdn = res.msisdn;
          return this.authServ.confirmMsisdnByNetwork(res.msisdn).pipe(
            take(1),
            tap(
              (response: ConfirmMsisdnModel) => {
                this.gettingNumber = false;
                if (response && response.status) {
                  this.numberGot = true;
                  this.phoneNumber = response.msisdn;
                  this.hmac = response.hmac;
                  const endTime = Date.now();
                  const elapsedSeconds = endTime - startTime;
                  const duration = `${elapsedSeconds} ms`;
                  console.log(duration);
                  this.followAnalyticsService.registerEventFollow(
                    'User_msisdn_recuperation_success',
                    'event',
                    {
                      msisdn: this.phoneNumber,
                      duration,
                    }
                  );
                } else {
                  this.displayMsisdnError();
                }
                if (!this.ref['destroyed']) this.ref.detectChanges();
              },
              () => {
                this.displayMsisdnError();
              }
            )
          );
        }),
        catchError(() => {
          //this.handleGetMsisdnError();
          this.displayMsisdnError();
          return of();
        })
      )
      .subscribe();
  }

  //async handleGetMsisdnError() {
  //  const modal = await this.modalController.create({
  //    component: MsisdnAssistanceModalComponent,
  //    cssClass: 'select-recipient-modal',
  //    backdropDismiss: false,
  //  });
  //  modal.onDidDismiss().then((response) => {
  //    this.getNumber();
  //  });
  //  return await modal.present();
  //}

  checkNumber() {
    this.checkingNumber = true;
    const payload = { msisdn: this.phoneNumber, hmac: this.hmac };
    this.checkNumberSubscription = this.authServ
      .checkNumberAccountStatus(payload)
      .subscribe(
        (status) => {
          // Go to registration page
          if (this.isResetPasswordAction) {
            this.step = 'PASSWORD';
            return;
          }
          if (status.accountStatus === AccountStatus.FULL) {
            this.checkingNumber = false;
            this.goLoginPage();
          } else if (status.accountStatus === AccountStatus.LITE) {
            this.resetPwdLight();
          }
          // this.step = 'PASSWORD';
        },
        (err: any) => {
          if (err.status === 400) {
            this.checkingNumber = false;
            if (err && err.error && err.error.errorKey === 'userRattached') {
              // this.showErrMessage = true;
              this.errorMsg = err.error.title;
              this.isNumberAttachedError = true;
            } else if (err.errorKey === PRO_MOBILE_ERROR_CODE) {
              this.errorMsg = err.message;
              this.isNumberAttachedError = true;
            } else {
              // err.error.errorKey === 'userexists'
              // Go to login page
              this.goLoginPage();
            }
          } else if (err.status === 404) {
            this.registerLight();
          } else {
            this.checkingNumber = false;
            this.showErrMessage = true;
            this.errorMsg =
              'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
          }
        }
      );
  }

  resetPwdLight() {
    const payload = {
      newPassword: 'Motdepasse10',
      hmac: this.hmac,
      login: this.phoneNumber,
    };
    this.authServ
      .resetPasswordV2(payload)
      .pipe(
        tap((res: any) => {
          this.redirectDashboardAfterLightLogin(res);
        }),
        catchError((err) => {
          this.checkingNumber = false;
          this.showErrMessage = true;
          this.errorMsg =
            'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
          return throwError(err);
        })
      )
      .subscribe();
  }

  registerLight() {
    const userInfo: RegistrationModel = {
      login: this.phoneNumber,
      password: 'OrangeEtMoi10',
      firstName: '',
      lastName: '',
      email: null,
      hmac: this.hmac,
      clientId: hash53(this.phoneNumber),
    };
    this.authServ
      .registerV3(userInfo)
      .pipe(
        tap((res: any) => {
          this.redirectDashboardAfterLightLogin(res);
        }),
        catchError((err) => {
          this.checkingNumber = false;
          this.showErrMessage = true;
          this.errorMsg =
            'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
          return throwError(err);
        })
      )
      .subscribe();
  }

  redirectDashboardAfterLightLogin(res) {
    this.checkingNumber = false;
    const username =
      this.phoneNumber && this.phoneNumber.startsWith('221')
        ? this.phoneNumber.substring(3)
        : this.phoneNumber;
    const authData = { access_token: res.access_token };
    this.authServ.storeAuthenticationData(authData, { username });
    this.router.navigate(['/']);
  }

  changePasswordVisibility(fieldName: string) {
    if (this.fields[fieldName].fieldType === 'text') {
      this.fields[fieldName].fieldType = 'password';
      this.fields[fieldName].visibilityIcon = 'visibility';
    } else {
      this.fields[fieldName].fieldType = 'text';
      this.fields[fieldName].visibilityIcon = 'visibility_off';
    }
  }

  async openAssistanceModal() {
    this.followAnalyticsService.registerEventFollow(
      'open_assistance_on_get_msisdn_modal',
      'event'
    );
    const modal = await this.modalController.create({
      component: MsisdnAssistanceModalComponent,
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }

  goSuccess() {
    this.creatingAccount = true;
    const userInfo: RegistrationModel = {
      login: this.phoneNumber,
      password: this.formPassword.value.password,
      firstName: '',
      lastName: '',
      email: null,
      hmac: this.hmac,
      clientId: hash53(this.phoneNumber),
    };
    this.authServ.register(userInfo).subscribe(
      () => {
        this.followAnalyticsService.registerEventFollow(
          'User_register_success',
          'event',
          userInfo.login
        );
        this.openSuccessModal();
        this.creatingAccount = false;
      },
      (err: any) => {
        this.creatingAccount = false;
        const { status, error } = err;
        this.showErrMessage = true;
        this.followAnalyticsService.registerEventFollow(
          'User_register_failed',
          'error',
          {
            msisdn: userInfo.login,
            status,
          }
        );
        if (status === 400) {
          // bad input
          this.errorMsg = error.title;
        } else {
          this.errorMsg = 'Une erreur est survenue';
        }
      }
    );
  }

  createAccount() {
    this.showErrMessage = false;
    const pwd = this.formPassword.value.password;
    const confirmPwd = this.formPassword.value.confirmPassword;
    if (pwd === confirmPwd) {
      if (pwd.length > 4) {
        // this.goSuccess();
        this.resetPassword();
      } else {
        this.showErrMessage = true;
        this.errorMsg = 'le mot de passe doit avoir au minumum 5 caractères';
      }
    } else {
      this.showErrMessage = true;
      this.errorMsg = 'les mots de passe ne sont pas identiques';
    }
  }

  resetPassword() {
    this.creatingAccount = true;
    const resetPwdPayload = {
      newPassword: this.formPassword.value.confirmPassword,
      hmac: this.hmac,
      login: this.phoneNumber,
    };
    this.authServ
      .resetPassword(resetPwdPayload)
      .pipe(
        tap((res) => {
          this.creatingAccount = false;
          this.followAnalyticsService.registerEventFollow(
            'Reset_password_success',
            'event',
            this.phoneNumber
          );
          this.openSuccessModal();
        }),
        catchError((err) => {
          this.creatingAccount = false;
          this.followAnalyticsService.registerEventFollow(
            'Reset_password_failed',
            'error',
            { msisdn: this.phoneNumber, status: err.status }
          );
          this.showErrMessage = true;
          this.errorMsg = 'Une erreur est survenue';
          return throwError(err);
        })
      )
      .subscribe();
  }

  openCguDialog() {
    this.dialog.open(CguPopupComponent, {
      data: { login: '' },
    });
  }

  goLoginPage() {
    let login: string;
    this.phoneNumber && this.phoneNumber.startsWith('221')
      ? (login = this.phoneNumber.substring(3))
      : (login = this.phoneNumber);
    ls.set('subscribedNumber', login);
    this.router.navigate(['/login']);
  }

  doAction(action: 'login' | 'help' | 'password') {
    if (action === 'login') {
      this.followAnalyticsService.registerEventFollow(
        'Go_login_from_register',
        'event'
      );
      this.goLoginPage();
    }
    if (action === 'help') {
      this.followAnalyticsService.registerEventFollow(
        'Open_help_modal_from_register',
        'event'
      );
      this.openHelpModal(HelpModalDefaultContent);
    }
    if (action === 'password') {
      this.followAnalyticsService.registerEventFollow(
        'Forgotten_pwd_from_register',
        'event'
      );
      if (!this.checkingNumber) {
        this.step = 'PASSWORD';
      }
    }
  }

  async openHelpModal(sheetData?: any) {
    const modal = await this.modalController.create({
      component: CommonIssuesComponent,
      cssClass: 'besoin-daide-modal',
      componentProps: { data: sheetData },
      swipeToClose: true,
    });
    return await modal.present();
  }

  displayMsisdnError() {
    this.gettingNumber = false;
    this.showErrMessage = true;
    this.errorMsg = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
    let connexion: string;
    console.log('connexionType', connexion);
    this.newtworkSubscription = this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        connexion = this.network.type;
        this.followAnalyticsService.registerEventFollow(
          'User_msisdn_recuperation_failed',
          'error',
          {
            imei: this.uid.IMEI,
            connexion,
          }
        );
      }, 3000);
    });
    if (!this.ref['destroyed']) this.ref.detectChanges();
  }

  async openSuccessModal() {
    let login: string;
    this.phoneNumber && this.phoneNumber.startsWith('221')
      ? (login = this.phoneNumber.substring(3))
      : (login = this.phoneNumber);
    const userCredential = {
      username: login,
      password: this.formPassword.value.password,
      rememberMe: true,
    };
    const modal = await this.modalController.create({
      component: RegistrationSuccessModalPage,
      cssClass: 'registration-success-modal',
      backdropDismiss: true,
      componentProps: { userCredential },
    });
    modal.onDidDismiss().then((response) => {
      if (!response?.data) {
        this.goLoginPage();
      }
    });
    return await modal.present();
  }

  goBack() {
    this.navController.navigateRoot(['/home']);
  }

	async enterUserPhoneNumber(phone?: string) {
		const modal = await this.modalController.create({
      component: TypePhoneNumberManuallyComponent,
      cssClass: 'select-recipient-modal',
			componentProps: {
				phoneNumber: phone
			},
      backdropDismiss: true,
    });
    modal.onDidDismiss().then((response) => {

    });
    return await modal.present();
	}

	checkIfAccessByOTP() {
		const accessHmac = this.route.snapshot.paramMap.get('hmac');
		const optAccessUserNumber = this.localServ.getFromLocalStorage(LOCAL_STORAGE_KEYS.NUMBER_FOR_OTP_REGISTRATION);
		console.log('accessHmac', accessHmac);

		if(optAccessUserNumber === '' || !optAccessUserNumber) {
			this.enterUserPhoneNumber();
			return
		}
		if(accessHmac) {
			this.showErrMessage = false;
			this.gettingNumber = true;
			const data: CheckOtpOem = {
				hmac:accessHmac
			}
			this.otpService.checkOTPSMS(data).subscribe(
				(res) => {

				}
			)
		}
	}
}
