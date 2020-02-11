import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { REGEX_NUMBER, REGEX_EMAIL, REGEX_PASSWORD2 } from 'src/shared';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as SecureLS from 'secure-ls';
import {
  AuthenticationService,
  ConfirmMsisdnModel
} from '../services/authentication-service/authentication.service';
import * as Fingerprint2 from 'fingerprintjs2';
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
  resetPasswordPayload = { login: null, hmac: null, newPassword: null };
  formPassword: FormGroup;
  currentStep = 1;
  error_message = '';
  identifier;
  identifierType;
  action = 'reinitializeMobile';
  token?: string;
  recaptchaScore = 0;
  fields = {
    password: { fieldType: 'password', visibilityIcon: 'visibility' },
    confirmPassword: { fieldType: 'password', visibilityIcon: 'visibility' }
  };
  gettingNumber: boolean;
  checkingNumber: boolean;
  numberGot: boolean;
  phoneNumber: string;
  hmac: string;
  resetingPwd: boolean;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private ref: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getNumber();
  }

  ionViewDidEnter() {
    this.getNumber();
  }

  getNumber() {
    this.error_message = '';
    this.gettingNumber = true;
    this.ref.detectChanges();
    Fingerprint2.get(components => {
      const values = components.map(component => {
        return component.value;
      });
      const x_uuid = Fingerprint2.x64hash128(values.join(''), 31);
      ls.set('X-UUID', x_uuid);
      this.authServ.getMsisdnByNetwork().subscribe(
        (res: { msisdn: string }) => {
          const msisdn = res.msisdn;
          this.authServ.confirmMsisdnByNetwork(msisdn).subscribe(
            (response: ConfirmMsisdnModel) => {
              this.gettingNumber = false;
              if (response.status) {
                this.numberGot = true;
                this.phoneNumber = response.msisdn;
                this.hmac = response.hmac;
              } else {
                this.error_message = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
              }
              this.ref.detectChanges();
            },
            err => {
              this.error_message = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
              this.ref.detectChanges();
            }
          );
        },
        err => {
          this.gettingNumber = false;
          this.error_message = `La récupération ne s'est pas bien passée. Assurez d'activer vos données mobiles Orange puis réessayez`;
          this.ref.detectChanges();
        }
      );
    });
  }

  goStepNewPassword() {
    this.currentStep = 2;
    this.formPassword = this.fb.group({
      password: [
        '',
        [Validators.required]
      ],
      passwordConfirmation: [
        '',
        [Validators.required]
      ]
    });
  }

  checkNumber() {
    this.checkingNumber = true;
    const payload = { msisdn: this.phoneNumber, hmac: this.hmac };
    this.authServ.checkNumber(payload).subscribe(
      (resp: any) => {
        // Go to registration page
        this.checkingNumber = false;
        this.error_message = 'Ce numéro ne possède pas de compte';
      },
      (err: any) => {
        this.checkingNumber = false;
        //  && err.error && err.error.errorKey === 'userexists'
        if (err.status === 400) {
          // Go to login page
          this.goStepNewPassword();
        } else {
          this.error_message =
            'Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci';
        }
      }
    );
  }

  onSubmitPassword() {
    this.error_message = '';
    const password = this.formPassword.value.password;
    const passwordConfirm = this.formPassword.value.passwordConfirmation;
    if (password === passwordConfirm) {
      if(password.length < 5){
        this.error_message = "le mot de passe doit avoir au minumum 5 caractères";
      }else {

        this.resetingPwd = true;
        this.resetPasswordPayload.newPassword = password;
        this.resetPasswordPayload.hmac = this.hmac;
        this.resetPasswordPayload.login = this.phoneNumber;
        this.authServ.resetPassword(this.resetPasswordPayload).subscribe(
          res => {
            this.resetingPwd = false;
            this.router.navigate(['/login']);
          },
          err => {
            this.resetingPwd = false;
            if (err.status === 400) {
              if (err.msg === 'invalidotp') {
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
      }
    } else {
      this.error_message = 'Les mots de passe saisis ne sont pas identiques';
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
    this.error_message = '';
    if (this.currentStep === 1) {
      this.router.navigate(['/login']);
    } else {
      this.currentStep = 1;
    }
  }
}
