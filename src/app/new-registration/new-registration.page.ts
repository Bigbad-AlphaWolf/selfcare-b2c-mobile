import {Component, OnInit, ChangeDetectorRef, NgZone, OnDestroy} from '@angular/core';
import {Subscription, timer, Subject, of} from 'rxjs';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {
  AuthenticationService,
  ConfirmMsisdnModel,
  RegistrationModel
} from '../services/authentication-service/authentication.service';
import {MatDialog, MatDialogRef} from '@angular/material';
import * as SecureLS from 'secure-ls';
import {CguPopupComponent} from 'src/shared/cgu-popup/cgu-popup.component';
const ls = new SecureLS({encodingType: 'aes'});
import {SettingsPopupComponent} from 'src/shared/settings-popup/settings-popup.component';
import {FollowAnalyticsService} from '../services/follow-analytics/follow-analytics.service';
import {takeUntil, finalize, catchError, switchMap, take, tap} from 'rxjs/operators';
import {
  HelpModalDefaultContent,
  HelpModalAuthErrorContent,
  PRO_MOBILE_ERROR_CODE,
  LIGHT_DASHBOARD_EVENT,
  REGISTRATION_PASSWORD_STEP
} from 'src/shared';
import {CommonIssuesComponent} from 'src/shared/common-issues/common-issues.component';
import {ModalController, NavController} from '@ionic/angular';
import {RegistrationSuccessModalPage} from '../registration-success-modal/registration-success-modal.page';
import {hash53} from '../dashboard';
import {Uid} from '@ionic-native/uid/ngx';
import {Network} from '@ionic-native/network/ngx';
import {MSISDN_RECUPERATION_TIMEOUT} from '../register';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.page.html',
  styleUrls: ['./new-registration.page.scss']
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
    password: {fieldType: 'password', visibilityIcon: 'visibility'},
    confirmPassword: {fieldType: 'password', visibilityIcon: 'visibility'}
  };
  navItems: {
    title: string;
    subTitle: string;
    action: 'help' | 'login' | 'password' | 'register';
  }[] = [
    {
      title: "J'ai déja un compte",
      subTitle: 'Je me connecte',
      action: 'login'
    },
    {
      title: 'J’ai oublié mon mot de passe',
      subTitle: 'Je le réinitialise',
      action: 'password'
    },
    {
      title: 'J’ai besoin d’aide',
      subTitle: "J'ai des difficultés pour me connecter",
      action: 'help'
    }
  ];
  //Temps d'attente pour la recuperation automatique du numero -> 10 secondes
  MSISDN_RECUPERATION_TIMEOUT = MSISDN_RECUPERATION_TIMEOUT;
  authErrorDetected = new Subject<any>();
  helpNeeded = new Subject<any>();
  firstCallMsisdn: string;
  isNumberAttachedError: boolean;
  newtworkSubscription: Subscription;
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
    private network: Network
  ) {
    this.authErrorDetected.subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.openHelpModal(HelpModalDefaultContent);
        });
      }
    });
    this.helpNeeded.subscribe({
      next: data => {
        this.openHelpModal(data);
      }
    });
  }

  ngOnDestroy() {
    if (this.newtworkSubscription) {
      this.newtworkSubscription.unsubscribe();
    }
  }

  ionViewWillEnter() {
    const step = history.state.step;
    if (step === REGISTRATION_PASSWORD_STEP) {
      this.step = 'PASSWORD';
    }
  }

  goIntro() {
    this.followAnalyticsService.registerEventFollow('Voir_Intro', 'event', 'clic');
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.step = 'CHECK_NUMBER';
    this.formPassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
    this.getNumber();
  }

  openDialogGoSettings() {
    this.dialogRef = this.dialog.open(SettingsPopupComponent);
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
          if ((!this.firstCallMsisdn && !this.showErrMessage) || (!this.firstCallMsisdn && this.showErrMessage)) {
            this.displayMsisdnError();
            this.authErrorDetected.next(HelpModalAuthErrorContent);
            console.log('http call is not successful');
          }
        }),
        switchMap((res: {msisdn: string}) => {
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
                  this.followAnalyticsService.registerEventFollow('User_msisdn_recuperation_success', 'event', {
                    msisdn: this.phoneNumber,
                    duration
                  });
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
          this.displayMsisdnError();
          this.openHelpModal(HelpModalDefaultContent);
          return of();
        })
      )
      .subscribe();
  }

  checkNumber() {
    const event = history.state.event;
    if (event === LIGHT_DASHBOARD_EVENT) {
      this.router.navigate(['dashboard-prepaid-light']);
      return;
    }
    this.checkingNumber = true;
    const payload = {msisdn: this.phoneNumber, hmac: this.hmac};
    this.checkNumberSubscription = this.authServ.checkNumber(payload).subscribe(
      () => {
        // Go to registration page
        this.checkingNumber = false;
        this.step = 'PASSWORD';
      },
      (err: any) => {
        this.checkingNumber = false;

        if (err.status === 400) {
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
          this.errorMsg = 'Orange et moi est disponible uniquement pour les numéros Orange et Kirene avec Orange';
          this.isNumberAttachedError = true;
        } else {
          this.showErrMessage = true;
          this.errorMsg = 'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
        }
      }
    );
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

  goSuccess() {
    this.creatingAccount = true;
    const userInfo: RegistrationModel = {
      login: this.phoneNumber,
      password: this.formPassword.value.password,
      firstName: '',
      lastName: '',
      email: null,
      hmac: this.hmac,
      clientId: hash53(this.phoneNumber)
    };
    this.authServ.register(userInfo).subscribe(
      () => {
        this.followAnalyticsService.registerEventFollow('User_register_success', 'event', userInfo.login);
        this.openSuccessModal();
        this.creatingAccount = false;
      },
      (err: any) => {
        this.creatingAccount = false;
        const {status, error} = err;
        this.showErrMessage = true;
        this.followAnalyticsService.registerEventFollow('User_register_failed', 'error', {
          msisdn: userInfo.login,
          status
        });
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
        this.goSuccess();
      } else {
        this.showErrMessage = true;
        this.errorMsg = 'le mot de passe doit avoir au minumum 5 caractères';
      }
    } else {
      this.showErrMessage = true;
      this.errorMsg = 'les mots de passe ne sont pas identiques';
    }
  }

  openCguDialog() {
    this.dialog.open(CguPopupComponent, {
      data: {login: ''}
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
      this.followAnalyticsService.registerEventFollow('Go_login_from_register', 'event');
      this.goLoginPage();
    }
    if (action === 'help') {
      this.followAnalyticsService.registerEventFollow('Open_help_modal_from_register', 'event');
      this.openHelpModal(HelpModalDefaultContent);
    }
    if (action === 'password') {
      this.followAnalyticsService.registerEventFollow('Forgotten_pwd_from_register', 'event');
      this.router.navigate(['/forgotten-password']);
    }
  }

  async openHelpModal(sheetData?: any) {
    const modal = await this.modalController.create({
      component: CommonIssuesComponent,
      cssClass: 'besoin-daide-modal',
      componentProps: {data: sheetData},
      swipeToClose: true
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
        this.followAnalyticsService.registerEventFollow('User_msisdn_recuperation_failed', 'error', {
          imei: this.uid.IMEI,
          connexion
        });
      }, 3000);
    });
    //this.openDialogGoSettings();
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
      rememberMe: true
    };
    const modal = await this.modalController.create({
      component: RegistrationSuccessModalPage,
      cssClass: 'registration-success-modal',
      backdropDismiss: true,
      componentProps: {userCredential}
    });
    modal.onDidDismiss().then(response => {
      // if (!response.data) {
      //   this.goLoginPage();
      // }
    });
    return await modal.present();
  }

  goBack() {
    this.navController.navigateBack(['/home-v2']);
  }
}
