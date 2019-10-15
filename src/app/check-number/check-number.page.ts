import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { captchaSiteKey } from '../register';
import { Subscription } from 'rxjs';
import { REGEX_NUMBER } from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-check-number',
  templateUrl: './check-number.page.html',
  styleUrls: ['./check-number.page.scss']
})
export class CheckNumberPage implements OnInit {
  showErrMessage = false;
  subscribedNumber: string;
  form: FormGroup;
  loading = false;
  errorMsg: string;
  public action = 'checkNumber';
  public token?: string;
  public recaptchaScore = 0;
  checkNumberSubscription: Subscription;
  generateOTPSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {
    this.form = this.fb.group({
      username: [
        this.subscribedNumber,
        [Validators.required, Validators.pattern(REGEX_NUMBER)]
      ]
    });
  }

  ngOnInit() {}

  setRegistrationInformation(phoneNumber: string) {
    ls.set('subscribedNumber', this.subscribedNumber);
    ls.set('rememberMe', true);
  }

  onSubmit() {
    this.showErrMessage = false;
    this.checkNumberStatus(this.subscribedNumber);
  }

  checkNumberStatus(phoneNumber: string) {
    this.loading = true;
    // check recaaptcha token
    this.reCaptchaV3Service.execute(
      captchaSiteKey,
      this.action,
      tokenResp => {
        this.token = tokenResp;
        // call backend to check phone number
        this.setRegistrationInformation(phoneNumber);
        this.checkNumberSubscription = this.authServ
          .checkUserStatus(phoneNumber, this.token)
          .subscribe(
            (resp: any) => {
              // Go to registration page
              this.loading = false;
              this.router.navigate(['/code-otp']);
            },
            (err: any) => {
              console.log(err);
              this.loading = false;
              //  && err.error && err.error.errorKey === 'userexists'
              if (err.status === 400) {
                // Go to login page
                this.router.navigate(['/login']);
              } else {
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

  goBack() {
    this.router.navigate(['/home']);
  }
}
