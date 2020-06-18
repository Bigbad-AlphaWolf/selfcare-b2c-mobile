import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription, timer, Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthenticationService,
  ConfirmMsisdnModel,
  RegistrationModel,
} from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { MatDialog, MatDialogRef, MatBottomSheet } from '@angular/material';
import * as SecureLS from 'secure-ls';
import { CguPopupComponent } from 'src/shared/cgu-popup/cgu-popup.component';
import * as Fingerprint2 from 'fingerprintjs2';
const ls = new SecureLS({ encodingType: 'aes' });
import { SettingsPopupComponent } from 'src/shared/settings-popup/settings-popup.component';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { takeUntil, finalize } from 'rxjs/operators';
import {
  HelpModalDefaultContent,
  HelpModalAuthErrorContent,
  HelpModalAPNContent,
  HelpModalConfigApnContent,
} from 'src/shared';
import { CommonIssuesComponent } from 'src/shared/common-issues/common-issues.component';
import { ModalController, NavController } from '@ionic/angular';
import { RegistrationSuccessModalPage } from '../registration-success-modal/registration-success-modal.page';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.page.html',
  styleUrls: ['./new-registration.page.scss'],
})
export class NewRegistrationPage implements OnInit {
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
    action: 'help' | 'login' | 'password';
  }[] = [
    {
      title: 'Je me connecte',
      subTitle: 'J’ai déjà un compte',
      action: 'login',
    },
    {
      title: 'J’ai besoin d’aide',
      subTitle: 'J’éprouve des difficultés pour me connecter',
      action: 'help',
    },
    {
      title: 'J’ai oublié mon mot de passe',
      subTitle: 'Je veux le récupérer',
      action: 'password',
    },
  ];
  //Temps d'attente pour la recuperation automatique du numero -> 10 secondes
  msisdnTimeout = 10000;
  authErrorDetected = new Subject<any>();
  helpNeeded = new Subject<any>();
  firstCallMsisdn: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private followAnalyticsService: FollowAnalyticsService,
    private bottomSheet: MatBottomSheet,
    private modalController: ModalController,
    private navController: NavController,
    private ngZone: NgZone
  ) {
    this.authErrorDetected.subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.openHelpModal(HelpModalDefaultContent);
        });
      },
    });
    this.helpNeeded.subscribe({
      next: (data) => {
        this.openHelpModal(data);
      },
    });
  }

  goIntro() {
    this.followAnalyticsService.registerEventFollow(
      'Voir_Intro',
      'event',
      'clic'
    );
    this.router.navigate(['/home']);
  }

  ngOnInit() {
    this.step = 'CHECK_NUMBER';
    this.formPassword = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    });
    this.getNumber();
  }

  openDialogGoSettings() {
    this.dialogRef = this.dialog.open(SettingsPopupComponent);
  }

  getNumber() {
    this.gettingNumber = true;
    this.showErrMessage = false;
    if (!this.ref['destroyed']) this.ref.detectChanges();
    Fingerprint2.get((components) => {
      const values = components.map((component) => {
        return component.value;
      });
      const x_uuid = Fingerprint2.x64hash128(values.join(''), 31);
      ls.set('X-UUID', x_uuid);
      this.authServ
        .getMsisdnByNetwork()
        //if after msisdnTimeout milliseconds the call does not complete, stop it.
        .pipe(
          takeUntil(timer(this.msisdnTimeout)),
          // finalize to detect whenever call is complete or terminated
          finalize(() => {
            if (
              (!this.firstCallMsisdn && !this.showErrMessage) ||
              (!this.firstCallMsisdn && this.showErrMessage)
            ) {
              this.displayMsisdnError();
              this.authErrorDetected.next(HelpModalAuthErrorContent);
              console.log('http call is not successful');
            }
          })
        )
        .subscribe(
          (res: { msisdn: string }) => {
            this.firstCallMsisdn = res.msisdn;
            this.authServ.confirmMsisdnByNetwork(res.msisdn).subscribe(
              (response: ConfirmMsisdnModel) => {
                this.gettingNumber = false;
                if (response !== undefined && response && response.status) {
                  this.numberGot = true;
                  this.phoneNumber = response.msisdn;
                  this.hmac = response.hmac;
                  this.followAnalyticsService.registerEventFollow(
                    'User_msisdn_recuperation_succes',
                    'event',
                    this.phoneNumber
                  );
                } else {
                  this.displayMsisdnError();
                }
                if (!this.ref['destroyed']) this.ref.detectChanges();
              },
              (err) => {
                this.displayMsisdnError();
              }
            );
          },
          (err) => {
            this.displayMsisdnError();
          }
        );
    });
  }

  checkNumber() {
    this.checkingNumber = true;
    const payload = { msisdn: this.phoneNumber, hmac: this.hmac };
    this.checkNumberSubscription = this.authServ.checkNumber(payload).subscribe(
      (resp: any) => {
        // Go to registration page
        this.checkingNumber = false;
        this.step = 'PASSWORD';
      },
      (err: any) => {
        this.checkingNumber = false;
        //  && err.error && err.error.errorKey === 'userexists'
        if (err.status === 400) {
          // Go to login page
          this.goLoginPage();
        } else {
          this.showErrMessage = true;
          this.errorMsg =
            'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
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
    };
    this.authServ.register(userInfo).subscribe(
      () => {
        this.followAnalyticsService.registerEventFollow(
          'User_register_succes',
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
          userInfo.login
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

  goLogin() {
    this.isLogging = true;
    let login: string;
    this.phoneNumber && this.phoneNumber.startsWith('221')
      ? (login = this.phoneNumber.substring(3))
      : (login = this.phoneNumber);
    const userCredential = {
      username: login,
      password: this.formPassword.value.password,
      rememberMe: true,
    };
    this.authServ.login(userCredential).subscribe(
      (res) => {
        this.dashbServ.getAccountInfo(userCredential.username).subscribe(
          (resp: any) => {
            this.isLogging = false;
            ls.set('user', resp);
            this.router.navigate(['/dashboard']);
            this.followAnalyticsService.registerEventFollow(
              'Authentication_Successful',
              'event',
              this.phoneNumber
            );
          },
          () => {
            this.isLogging = false;
            this.followAnalyticsService.registerEventFollow(
              'Authentication_Failed',
              'error',
              this.phoneNumber
            );
          }
        );
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'Authentication_Failed',
          'error',
          this.phoneNumber
        );
        this.router.navigate(['/login']);
      }
    );
  }

  doAction(action: 'login' | 'help' | 'password') {
    if (action === 'login') {
      this.goLoginPage();
    }
    if (action === 'help') {
      this.openHelpModal(HelpModalDefaultContent);
    }
    if (action === 'password') {
      this.router.navigate(['/forgotten-password']);
    }
  }

  openHelpModal(sheetData?: any) {
    this.bottomSheet
      .open(CommonIssuesComponent, {
        panelClass: 'custom-css-common-issues',
        data: sheetData,
      })
      .afterDismissed()
      .subscribe((message: string) => {
        if (message === 'ERROR_AUTH_IMP') {
          this.openHelpModal(HelpModalAuthErrorContent);
        }
        if (message === 'APN_AUTH_IMP') {
          this.openHelpModal(HelpModalAPNContent);
        }
        if (message === 'CONFIG_APN_AUTH_IMP') {
          this.openHelpModal(HelpModalConfigApnContent);
        }
      });
  }

  displayMsisdnError() {
    this.gettingNumber = false;
    this.showErrMessage = true;
    this.errorMsg = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
    //this.openDialogGoSettings();
    this.followAnalyticsService.registerEventFollow(
      'User_msisdn_recuperation_failed',
      'error',
      this.phoneNumber
    );
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
      console.log(response);
      if (!response.data) {
        this.goLoginPage();
      }
    });
    return await modal.present();
  }

  goBack() {
    this.navController.navigateBack(['/home-v2']);
  }
}
