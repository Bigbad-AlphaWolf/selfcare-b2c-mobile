import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
const ls = new SecureLS({ encodingType: 'aes' });
import * as Fingerprint2 from 'fingerprintjs2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  showErrMessage = false;
  pFieldType = 'password';
  subscribedNumber: string;
  rememberMe = true;
  form: FormGroup;
  loading = false;
  errorMsg: string;
  USER_ERROR_MSG_BLOCKED =
    'Votre Compte Orange et Moi a été bloqué. Cliquez sur mot de passe oublié et suivez les instructions.';
  // dialogRef: MatDialogRef<RememberMeModalComponent, any>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.subscribedNumber, [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [this.rememberMe]
    });
    const uuid = ls.get('X-UUID');
    if (!uuid) {
      Fingerprint2.get(components => {
        const values = components.map(component => {
          return component.value;
        });
        const x_uuid = Fingerprint2.x64hash128(values.join(''), 31);
        ls.set('X-UUID', x_uuid);
      });
    }
  }

  ionViewWillEnter() {
    this.getRegistrationInformation();
  }

  getRegistrationInformation() {
    this.subscribedNumber = ls.get('subscribedNumber');
  }

  goToHomePage() {
    this.router.navigate(['/']);
  }

  onSubmit() {
    this.showErrMessage = false;
    const value = this.form.value;
    this.rememberMe = true;
    this.UserLogin(value);
  }

  UserLogin(user: any) {
    this.loading = true;
    this.authServ.login(user).subscribe(
      res => {
        this.dashbServ.getAccountInfo(user.username).subscribe(
          (resp: any) => {
            this.loading = false;
            ls.set('user', resp);
            this.dashbServ.setCurrentPhoneNumber(user.username);
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.loading = false;
          }
        );
      },
      err => {
        this.loading = false;
        this.showErrMessage = true;
        if (err && err.error.status === 400) {
          if (err.error.params !== '0' && err.error.params !== '-1') {
            this.errorMsg =
              err.error.title +
              ' ' +
              err.error.params +
              ' tentative' +
              (err.error.params === '1' ? '' : 's');
          } else if (err.error.params === '-1') {
            this.errorMsg = 'Login et mot de passe incorrect';
          } else {
            this.errorMsg = this.USER_ERROR_MSG_BLOCKED;
          }
        } else {
          this.errorMsg = 'Login ou mot de passe incorrect';
        }
      }
    );
  }

  launchRemembermeModal(user: any) {
    // if (!user.rememberMe) {
    //   this.dialogRef = this.dialog.open(RememberMeModalComponent, {
    //     maxWidth: '100%'
    //   });
    //   this.dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       user.rememberMe = result;
    //     }
    //     this.UserLogin(user);
    //   });
    // } else {
    //   this.UserLogin(user);
    // }
  }

  changePasswordVisibility() {
    if (this.pFieldType === 'text') {
      this.pFieldType = 'password';
    } else {
      this.pFieldType = 'text';
    }
  }

  forgetPassword() {
    this.router.navigate(['/reinitialize-password']);
  }
}
