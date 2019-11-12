import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import {
  AuthenticationService,
  RegistrationData
} from "../services/authentication-service/authentication.service";
import * as SecureLS from "secure-ls";
import { DashboardService } from "../services/dashboard-service/dashboard.service";
import { CguPopupComponent } from "src/shared/cgu-popup/cgu-popup.component";
import { NavController } from "@ionic/angular";
const ls = new SecureLS({ encodingType: "aes" });
@Component({
  selector: "app-create-password",
  templateUrl: "./create-password.page.html",
  styleUrls: ["./create-password.page.scss"]
})
export class CreatePasswordPage implements OnInit {
  showErrMessage = false;
  pFieldType = "password";
  subscribedNumber: string;
  rememberMe = false;
  form: FormGroup;
  loading = false;
  errorMsg: string;
  userInfo: RegistrationData;
  registrationSuccess = false;
  isLoging = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authServ: AuthenticationService,
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getUserInfo();
    this.form = this.fb.group({
      pwd: ["", [Validators.required]],
      confirmPwd: ["", [Validators.required]],
      acceptCGU: [false, [Validators.requiredTrue]]
    });
  }

  getUserInfo() {
    this.userInfo = ls.get("u");
  }

  onSubmit() {
    this.showErrMessage = false;
    const pwd = this.form.value.pwd;
    const confirmPwd = this.form.value.confirmPwd;
    if (pwd === confirmPwd) {
      this.goSuccess(pwd);
    } else {
      this.showErrMessage = true;
      this.errorMsg = "les mots de passe ne sont pas identiques";
    }
  }

  changePasswordVisibility() {
    if (this.pFieldType === "text") {
      this.pFieldType = "password";
    } else {
      this.pFieldType = "text";
    }
  }

  goSuccess(pwd: string) {
    this.userInfo.password = pwd;
    this.authServ.registerUser(this.userInfo).subscribe(
      () => {
        // Show success popup
        // Login automatically
        this.registrationSuccess = true;
      },
      (err: any) => {
        const { status, error } = err;
        this.showErrMessage = true;
        if (status === 400 && error.title) {
          // bad input
          this.errorMsg = error.title;
        } else {
          this.errorMsg = "Une erreur est survenue";
        }
      }
    );
  }

  openCguDialog() {
    const dialogRef = this.dialog.open(CguPopupComponent, {
      data: { login: "" }
    });
    dialogRef.afterClosed().subscribe(confirmresult => {
      const pwd = this.form.value.pwd;
      const confirmPwd = this.form.value.confirmPwd;
      this.form.setValue({ pwd, confirmPwd, acceptCGU: true });
    });
  }

  goLogin() {
    this.isLoging = true;
    const userCredential = {
      username: this.userInfo.login,
      password: this.form.value.pwd,
      rememberMe: true
    };
    this.authServ.login(userCredential).subscribe(
      res => {
        // FollowAnalytics.logEvent('Authentication_Successful', userCredential.username);
        this.dashboardService.getAccountInfo(userCredential.username).subscribe(
          (resp: any) => {
            this.isLoging = false;
            ls.set("user", resp);
            this.router.navigate(["/dashboard"]);
          },
          () => {
            this.isLoging = false;
          }
        );
      },
      err => {
        this.router.navigate(["/login"]);
      }
    );
  }

  goBack() {
    this.navCtrl.pop();
  }
}
