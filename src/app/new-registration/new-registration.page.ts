import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
const ls = new SecureLS({ encodingType: 'aes' });
import { SettingsPopupComponent } from 'src/shared/settings-popup/settings-popup.component';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { takeUntil, finalize, catchError, switchMap, take, tap } from 'rxjs/operators';
import { PRO_MOBILE_ERROR_CODE, FORGOT_PWD_PAGE_URL, LOCAL_STORAGE_KEYS, REGEX_NUMBER, REGEX_NUMBER_OM, parsedMsisdn } from 'src/shared';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { hash53 } from '../dashboard';
import { Uid } from '@ionic-native/uid/ngx';
import { MSISDN_RECUPERATION_TIMEOUT } from '../register';
import { TypePhoneNumberManuallyComponent } from './components/type-phone-number-manually/type-phone-number-manually.component';
import { LocalStorageService } from '../services/localStorage-service/local-storage.service';
import { OtpService } from '../services/otp-service/otp.service';
import { CheckOtpOem } from '../models/check-otp-oem.model';
import { RattachByOtpCodeComponent } from '../pages/rattached-phones-number/components/rattach-by-otp-code/rattach-by-otp-code.component';

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
  checkNumberSubscription: Subscription;
  checkingNumber: boolean;
  creatingAccount: boolean;
  gettingNumber: boolean;
  numberGot: boolean;
  isLogging: boolean;
  showErrMessage: boolean;
  errorMsg: string;
  hmac: string;
  //Temps d'attente pour la recuperation automatique du numero -> 10 secondes
  MSISDN_RECUPERATION_TIMEOUT = MSISDN_RECUPERATION_TIMEOUT;
  firstCallMsisdn: string;
  isNumberAttachedError: boolean;
  hideRefresh: boolean;
  isHmacValid: boolean;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private followAnalyticsService: FollowAnalyticsService,
    private modalController: ModalController,
    private navController: NavController,
    private uid: Uid,
    private route: ActivatedRoute,
    private localServ: LocalStorageService,
    private otpService: OtpService,
    public platform: Platform
  ) {}

  ngOnDestroy() {}

  ionViewWillEnter() {}

  goIntro() {
    this.followAnalyticsService.registerEventFollow('Voir_Intro', 'event', 'clic');
    this.navController.navigateRoot(FORGOT_PWD_PAGE_URL);
  }

  ngOnInit() {
    this.form = this.fb.group({ msisdn: ['', [Validators.required, Validators.pattern(REGEX_NUMBER_OM)]] });
    this.getNumber();
    this.hideRefresh = false;
  }

  getNumber(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.phoneNumber = null;
    this.form.patchValue({msisdn: null})
    const startTime = Date.now();
    this.gettingNumber = true;
    this.showErrMessage = false;
    this.isNumberAttachedError = false;
    this.authServ
      .getMsisdnByNetwork()
      //if after msisdnTimeout milliseconds the call does not complete, stop it.
      .pipe(
        takeUntil(timer(MSISDN_RECUPERATION_TIMEOUT)),
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
                  const formattedMsisdn = parsedMsisdn(this.phoneNumber);
                  if (!this.form.get('msisdn').value) this.form.patchValue({ msisdn: formattedMsisdn });
                  this.hmac = response.hmac;
                  const endTime = Date.now();
                  const elapsedSeconds = endTime - startTime;
                  const duration = `${elapsedSeconds} ms`;
                  console.log(duration);
                  this.followAnalyticsService.registerEventFollow('User_msisdn_recuperation_success', 'event', {
                    msisdn: this.phoneNumber,
                    duration,
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
          // this.displayMsisdnError();
          return of();
        })
      )
      .subscribe();
  }

  checkNumber(hmacFromOTP?: string) {
    this.checkingNumber = true;
    const payload = { msisdn: this.phoneNumber, hmac: this.hmac };
    if (!hmacFromOTP && (!this.phoneNumber || parsedMsisdn(this.phoneNumber) !== parsedMsisdn(this.form.get('msisdn').value))) {
      this.otpService
        .generateOTPCode(this.form.get('msisdn').value)
        .pipe(
          tap(codeSent => {
            this.checkingNumber = false;
            this.openTypeOtpModal(parsedMsisdn(this.form.get('msisdn').value));
          })
        )
        .subscribe();
      return;
    }
    if (hmacFromOTP) {
      this.phoneNumber = payload.msisdn = parsedMsisdn(this.form.get('msisdn').value); 
      this.hmac = payload.hmac = hmacFromOTP;
    }
    this.checkNumberSubscription = this.authServ.checkNumberAccountStatus(payload).subscribe(
      status => {
        this.resetPwdLight();
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
          this.errorMsg = 'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
        }
      }
    );
  }

  async openTypeOtpModal(number: string) {
    const modal = await this.modalController.create({
      component: RattachByOtpCodeComponent,
      componentProps: {
        number,
        action: 'ACCESS_BY_OTP'
      },
      cssClass: 'select-recipient-modal',
    });
    modal.onDidDismiss().then(res => {
      const response = res.data;
      if (response?.valid) {
        const hmac = response?.hmac;
        this.checkNumber(hmac);
      }
    });
    return await modal.present();
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
        catchError(err => {
          this.checkingNumber = false;
          this.showErrMessage = true;
          this.errorMsg = 'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
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
        catchError(err => {
          this.checkingNumber = false;
          this.showErrMessage = true;
          this.errorMsg = 'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
          return throwError(err);
        })
      )
      .subscribe();
  }

  redirectDashboardAfterLightLogin(res) {
    this.checkingNumber = false;
    const username = this.phoneNumber && this.phoneNumber.startsWith('221') ? this.phoneNumber.substring(3) : this.phoneNumber;
    const authData = { access_token: res.access_token };
    this.authServ.storeAuthenticationData(authData, { username });
    this.router.navigate(['/']);
  }

  goLoginPage() {
    let login: string;
    this.phoneNumber && this.phoneNumber.startsWith('221') ? (login = this.phoneNumber.substring(3)) : (login = this.phoneNumber);
    ls.set('subscribedNumber', login);
    this.router.navigate(['/login']);
  }

  displayMsisdnError() {
    this.gettingNumber = false;
    this.showErrMessage = true;
    this.errorMsg = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
  }

  goBack() {
    this.navController.navigateRoot(['/home']);
  }

  async enterUserPhoneNumber(phone?: string) {
    const modal = await this.modalController.create({
      component: TypePhoneNumberManuallyComponent,
      cssClass: 'select-recipient-modal',
      componentProps: {
        phoneNumber: phone,
      },
      backdropDismiss: true,
    });
    modal.onDidDismiss().then(response => {});
    return await modal.present();
  }
}
