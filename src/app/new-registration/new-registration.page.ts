import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AuthenticationService,
  ConfirmMsisdnModel,
  RegistrationModel
} from '../services/authentication-service/authentication.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import * as SecureLS from 'secure-ls';
import { CguPopupComponent } from 'src/shared/cgu-popup/cgu-popup.component';
import * as Fingerprint2 from 'fingerprintjs2';
const ls = new SecureLS({ encodingType: 'aes' });
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { SettingsPopupComponent } from 'src/shared/settings-popup/settings-popup.component';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.page.html',
  styleUrls: ['./new-registration.page.scss']
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
  step: 'CHECK_NUMBER' | 'PASSWORD' | 'SUCCESS';
  fields = {
    password: { fieldType: 'password', visibilityIcon: 'visibility' },
    confirmPassword: { fieldType: 'password', visibilityIcon: 'visibility' }
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private openNativeSettings: OpenNativeSettings
  ) {}

  goIntro() {
    this.router.navigate(['/']);
  }

  ngOnInit() {
    this.step = 'CHECK_NUMBER';
    this.formPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(5)]]
    });
    this.getNumber();
  }

  openDialogGoSettings() {
    this.dialogRef = this.dialog.open(SettingsPopupComponent);
    this.dialogSub = this.dialogRef.afterClosed().subscribe(settings => {
      if (settings) {
        this.goSettings();
      }
    });
  }

  goSettings() {
    this.openNativeSettings
      .open('settings')
      .then(res => {})
      .catch(err => {});
  }

  getNumber() {
    this.gettingNumber = true;
    this.showErrMessage = false;
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
                this.showErrMessage = true;
                this.errorMsg = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
                this.openDialogGoSettings();
              }
              this.ref.detectChanges();
            },
            err => {
              this.gettingNumber = false;
              this.showErrMessage = true;
              this.errorMsg = `La récupération ne s'est pas bien passée. Cliquez ici pour réessayer`;
              this.openDialogGoSettings();
              this.ref.detectChanges();
            }
          );
        },
        err => {
          this.gettingNumber = false;
          this.showErrMessage = true;
          this.errorMsg = `La récupération ne s'est pas bien passée. Assurez d'activer vos données mobiles Orange puis réessayez`;
          this.openDialogGoSettings();
          this.ref.detectChanges();
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
        console.log(err);
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
      hmac: this.hmac
    };
    this.authServ.register(userInfo).subscribe(
      () => {
        this.step = 'SUCCESS';
        this.creatingAccount = false;
      },
      (err: any) => {
        this.creatingAccount = false;
        const { status, error } = err;
        this.showErrMessage = true;
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
      this.goSuccess();
    } else {
      this.showErrMessage = true;
      this.errorMsg = 'les mots de passe ne sont pas identiques';
    }
  }

  openCguDialog() {
    const dialogRef = this.dialog.open(CguPopupComponent, {
      data: { login: '' }
    });
    dialogRef.afterClosed().subscribe(confirmresult => {
      const password = this.formPassword.value.password;
      const confirmPassword = this.formPassword.value.confirmPassword;
      this.formPassword.setValue({
        password,
        confirmPassword,
        acceptCGU: true
      });
    });
  }

  goLoginPage() {
    let login: string;
    this.phoneNumber.startsWith('221')
      ? (login = this.phoneNumber.substring(3))
      : (login = this.phoneNumber);
    ls.set('subscribedNumber', login);
    this.router.navigate(['/login']);
  }

  goLogin() {
    this.isLogging = true;
    let login: string;
    this.phoneNumber.startsWith('221')
      ? (login = this.phoneNumber.substring(3))
      : (login = this.phoneNumber);
    const userCredential = {
      username: login,
      password: this.formPassword.value.password,
      rememberMe: true
    };
    this.authServ.login(userCredential).subscribe(
      res => {
        // FollowAnalytics.logEvent('Authentication_Successful', userCredential.username);
        this.dashbServ.getAccountInfo(userCredential.username).subscribe(
          (resp: any) => {
            this.isLogging = false;
            ls.set('user', resp);
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.isLogging = false;
          }
        );
      },
      err => {
        this.router.navigate(['/login']);
      }
    );
  }
}
