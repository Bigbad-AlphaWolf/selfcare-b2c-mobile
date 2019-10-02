import { RegistrationData } from './../services/authentication-service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { captchaSiteKey, isOTPValid, registrationSteps } from '../register';
import { Subscription } from 'rxjs';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-code-otp',
  templateUrl: './code-otp.page.html',
  styleUrls: ['./code-otp.page.scss']
})
export class CodeOtpPage implements OnInit {
  showErrMessage = false;
  subscribedNumber: string;
  rememberMe = false;
  form: FormGroup;
  loading = false;
  showAlertAvantages = true;
  errorMsg: string;
  codeOtp: string;
  firstName: string;
  lastName: string;
  checkOTPSubscription: Subscription;
  generateOTPSubscription: Subscription;
  public action = 'otp';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.form = this.fb.group({
      codeotp: [this.codeOtp, [Validators.required]],
      rememberMe: [this.rememberMe]
    });
  }

  getUserInfo() {
    this.subscribedNumber = ls.get('subscribedNumber');
  }

  ionViewWillEnter() {
    this.sendOtp();
  }

  sendOtp() {
    this.loading = true;
    this.reCaptchaV3Service.execute(
      captchaSiteKey,
      this.action,
      token2 => {
        this.generateOTPSubscription = this.authServ
          .generateUserOtp(this.subscribedNumber, token2)
          .subscribe(
            (res: any) => {
              this.loading = false;
              // otp sent, go to code otp page
              // this.router.navigate(['/code-otp']);
            },
            (err: any) => {
              if (err.status === 504) {
                // this.router.navigate(['/code-otp']);
                this.loading = false;
              } else {
                this.loading = false;
                this.showErrMessage = true;
                this.errorMsg =
                  'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
              }
            }
          );
      },
      {
        useGlobalDomain: false
      }
    );
  }
  onSubmit() {
    this.showErrMessage = false;
    this.loading = true;
    // check otp code then if good move to create password page
    if (isOTPValid(this.codeOtp)) {
      this.checkOTPSubscription = this.authServ
        .getInfosAbonneWithOTP(this.subscribedNumber, this.codeOtp)
        .subscribe(
          (resp: any) => {
            this.loading = false;
            if (
              resp &&
              resp.nomAbonne &&
              resp.prenomAbonne &&
              (resp.nomAbonne !== 'ND' && resp.prenomAbonne !== 'ND')
            ) {
              const { nomAbonne, prenomAbonne } = resp;
              this.firstName = prenomAbonne;
              this.lastName = nomAbonne;
              this.router.navigate(['/create-password']);
            } else {
              this.firstName = '';
              this.lastName = '';
            }
            const userInfo: RegistrationData = {
              firstName: this.firstName,
              lastName: this.lastName,
              login: this.subscribedNumber,
              password: '',
              email: null
            };
            ls.set('u', userInfo);
          },
          (err: any) => {
            if (err.status === 400) {
              this.loading = false;
              this.errorMsg =
                registrationSteps['EXPIRED_VALIDATION_CODE'].messages[0];
            } else {
              this.loading = false;
              this.showErrMessage = true;
              this.errorMsg =
                'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
            }
          }
        );
    } else {
      this.showErrMessage = true;
      this.errorMsg = registrationSteps['WRONG_VALIDATION_CODE'].messages[0];
    }
  }

  hideAlert() {
    this.showAlertAvantages = false;
  }
}
