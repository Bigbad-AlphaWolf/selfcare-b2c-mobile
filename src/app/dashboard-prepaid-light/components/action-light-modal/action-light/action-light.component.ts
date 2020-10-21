import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication-service/authentication.service';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from 'src/app/services/follow-analytics/follow-analytics.service';
import * as SecureLS from 'secure-ls';
import { USER_ERROR_MSG_BLOCKED } from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-action-light',
  templateUrl: './action-light.component.html',
  styleUrls: ['./action-light.component.scss'],
})
export class ActionLightComponent implements OnInit {
  showErrMessage = false;
  pFieldType = 'password';
  number: string = this.dashbServ.getCurrentPhoneNumber();
  rememberMe = true;
  form: FormGroup;
  loading = false;
  errorMsg: string;

  constructor(
    private router: Router,
    private modalController: ModalController,
    private fb: FormBuilder,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.number, [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [this.rememberMe],
    });
  }

  goForgotPassword() {
    this.router.navigate(['/forgotten-password']);
    this.modalController.dismiss();
  }

  changePasswordVisibility() {
    if (this.pFieldType === 'text') {
      this.pFieldType = 'password';
    } else {
      this.pFieldType = 'text';
    }
  }

  login() {
    const user = {
      username: this.form.value.username,
      password: this.form.value.password,
      rememberMe: true,
    };
    this.loading = true;
    this.authServ.login(user).subscribe(
      () => {
        ls.remove('light-token');
        this.followAnalyticsService.registerEventFollow(
          'login_success',
          'event',
          user.username
        );
        this.dashbServ.getAccountInfo(user.username).subscribe(
          (resp: any) => {
            this.loading = false;
            this.modalController.dismiss();
            ls.set('user', resp);
            this.dashbServ.setCurrentPhoneNumber(user.username);
            this.router.navigate(['/dashboard']);
          },
          () => {
            this.loading = false;
          }
        );
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'login_failed',
          'error',
          user.username
        );
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
            this.errorMsg = USER_ERROR_MSG_BLOCKED;
          }
        } else {
          this.errorMsg = 'Login ou mot de passe incorrect';
        }
      }
    );
  }
}
