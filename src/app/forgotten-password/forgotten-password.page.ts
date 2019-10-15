import { Component, OnInit } from '@angular/core';
import { REGEX_NUMBER, REGEX_EMAIL, REGEX_PASSWORD2 } from 'src/shared';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { captchaSiteKey } from '../register';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });
export interface Description {
  text: string;
}

@Component({
  selector: 'app-forgotten-password',
  templateUrl: './forgotten-password.page.html',
  styleUrls: ['./forgotten-password.page.scss']
})
export class ForgottenPasswordPage implements OnInit {
  resetPasswordPayload = { login: null, otp: null, newPassword: null };
  formIdentifier: FormGroup;
  formPassword: FormGroup;
  currentStep = 1;
  error_message = '';
  identifier;
  identifierType;
  action = 'reinitializeMobile';
  token?: string;
  recaptchaScore = 0;
  loading = false;
  fields = {
    password: { fieldType: 'password', visibilityIcon: 'visibility' },
    confirmPassword: { fieldType: 'password', visibilityIcon: 'visibility' }
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dahbServ: DashboardService,
    private reCaptchaV3Service: ReCaptchaV3Service
  ) {
    this.formIdentifier = this.fb.group({
      inputValue: ['', [Validators.required, Validators.pattern(REGEX_NUMBER)]]
    });
  }

  ngOnInit() {}

  goStepNewPassword() {
    this.currentStep = 2;
    this.formPassword = this.fb.group({
      password: [
        '',
        [Validators.required, Validators.pattern(REGEX_PASSWORD2)]
      ],
      passwordConfirmation: [
        '',
        [Validators.required, Validators.pattern(REGEX_PASSWORD2)]
      ],
      otp: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)]
      ]
    });
  }

  ionViewWillEnter() {
    this.identifier = ls.get('subscribedNumber');
    this.formIdentifier.patchValue({
      inputValue: this.identifier
    });
  }

  userSendIdentifier() {
    this.loading = true;
    //check recaaptcha
    this.reCaptchaV3Service.execute(captchaSiteKey, this.action, tokenResp => {
      this.token = tokenResp;
      // make request to send OTP
      this.identifier = this.formIdentifier.value.inputValue;
      if (REGEX_NUMBER.test(this.identifier)) {
        this.identifierType = 'number';
        // send otp to client
        this.dahbServ
          .generateOtpForResetPwd(this.identifier, this.token)
          .subscribe(
            (res: any) => {
              this.loading = false;
              this.resetPasswordPayload.login = this.identifier;
              this.goStepNewPassword();
            },
            err => {
              this.loading = false;
              if (err.status === 404) {
                this.error_message = 'Ce numéro n a pas de compte';
              } else {
                this.error_message =
                  'Une erreur est survenue. Veuillez réessayer';
              }
            }
          );
      } else if (REGEX_EMAIL.test(this.identifier)) {
        this.identifierType = 'email';
      }
    });
  }

  onSubmitPassword() {
    this.error_message = '';
    const password = this.formPassword.value.password;
    const passwordConfirm = this.formPassword.value.passwordConfirmation;
    const otp = this.formPassword.value.otp;
    if (password === passwordConfirm) {
      this.resetPasswordPayload.newPassword = password;
      this.resetPasswordPayload.otp = otp;
      this.loading = true;
      this.dahbServ.reinitializePassword(this.resetPasswordPayload).subscribe(
        res => {
          this.router.navigate(['/login']);
        },
        err => {
          this.loading = false;
          if (err.status === 400) {
            if (err.error && err.error.msg === 'invalidotp') {
              this.error_message = 'Le code saisi est incorrect';
            } else {
              this.error_message =
                "Le nouveau mot de passe saisi n'est pas autorisé";
            }
          } else if (err.status === 503) {
            this.error_message = 'Service momentanément indisponible';
          } else {
            this.error_message = 'Une erreur est survenue. Veuillez réessayer';
          }
        }
      );
    } else {
      this.error_message = 'Les deux mots de passe ne sont pas identiques';
    }
  }

  togglePasswordVisibility(fieldName: string) {
    if (this.fields[fieldName].fieldType === 'text') {
      this.fields[fieldName].fieldType = 'password';
      this.fields[fieldName].visibilityIcon = 'visibility';
    } else {
      this.fields[fieldName].fieldType = 'text';
      this.fields[fieldName].visibilityIcon = 'visibility_off';
    }
  }

  goToPreviousStep() {
    if (this.currentStep === 1) {
      this.router.navigate(['/login']);
    } else {
      this.currentStep = 1;
    }
  }
}
