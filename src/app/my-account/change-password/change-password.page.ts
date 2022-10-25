import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {AccountService} from 'src/app/services/account-service/account.service';
import {MatDialog} from '@angular/material/dialog';
import {REGEX_PASSWORD2} from 'src/shared';
import {AuthenticationService} from 'src/app/services/authentication-service/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss']
})
export class ChangePasswordPage implements OnInit {
  actualPwdVisible = false;
  newPwdVisible = false;
  confirmNewPwdVisible = false;
  pwdVisibility = {true: 'text', false: 'password'};
  form: FormGroup;
  loading;
  error = '';

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private authServ: AuthenticationService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.accountService.changedPasswordEmit().subscribe(res => {
      this.loading = false;
      this.error = res;
    });
  }

  changeActualpwdVisibility() {
    this.actualPwdVisible = !this.actualPwdVisible;
  }

  changeNewPwdVisibility() {
    this.newPwdVisible = !this.newPwdVisible;
  }

  changeConfPwdVisibility() {
    this.confirmNewPwdVisible = !this.confirmNewPwdVisible;
  }

  getInputType(pwdVisible: boolean) {
    return pwdVisible ? this.pwdVisibility.true : this.pwdVisibility.false;
  }

  changePassword() {
    this.error = '';
    const login = this.authServ.getUserMainPhoneNumber();
    const newPassword = this.form.value.newPassword;
    const confirmPwd = this.form.value.confirmPassword;
    if (confirmPwd === newPassword) {
      if (confirmPwd.length < 5) {
        this.error = 'le mot de passe doit avoir au minumum 5 caractères';
      } else {
        this.loading = true;
        this.accountService.changeUserPassword(login, newPassword);
      }
    } else {
      this.error = 'Les mots de passe saisis ne sont pas identiques';
    }
  }
}
