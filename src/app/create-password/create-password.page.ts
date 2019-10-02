import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import {
  AuthenticationService,
  RegistrationData
} from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss']
})
export class CreatePasswordPage implements OnInit {
  showErrMessage = false;
  pFieldType = 'password';
  subscribedNumber: string;
  rememberMe = false;
  form: FormGroup;
  loading = false;
  errorMsg: string;
  userInfo: RegistrationData;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.form = this.fb.group({
      pwd: ['', [Validators.required]],
      confirmPwd: ['', [Validators.required]],
      rememberMe: [this.rememberMe]
    });
  }

  getUserInfo() {
    this.userInfo = ls.get('u');
    console.log(this.userInfo);
  }

  onSubmit() {
    this.showErrMessage = false;
    const pwd = this.form.value.pwd;
    const confirmPwd = this.form.value.confirmPwd;
    if (pwd === confirmPwd) {
      this.goSuccess(pwd);
    }
  }

  changePasswordVisibility() {
    if (this.pFieldType === 'text') {
      this.pFieldType = 'password';
    } else {
      this.pFieldType = 'text';
    }
  }

  goSuccess(pwd: string) {
    this.userInfo.password = pwd;
    this.authServ.registerUser(this.userInfo).subscribe(
      () => {
        // Show success popup
        // Login automatically
      },
      (err: any) => {
        const { status, error } = err;
        this.showErrMessage = true;
        if (status === 400) {
          // bad input
          if (error.fieldErrors) {
            const errorsMsgs = error.fieldErrors.map((x: any) => x.message);
            this.errorMsg = errorsMsgs.join(' ');
          } else if (error.message === 'error.userexists') {
            this.errorMsg = error.title;
          } else {
            this.errorMsg = err;
          }
        }
      }
    );
  }
}
