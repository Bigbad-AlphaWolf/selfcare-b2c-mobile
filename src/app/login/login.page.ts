import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
const ls = new SecureLS({ encodingType: 'aes' });
import { FORGOT_PWD_PAGE_URL, HelpModalDefaultContent } from 'src/shared';
import { CommonIssuesComponent } from 'src/shared/common-issues/common-issues.component';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { NavController, ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  showErrMessage = false;
  pFieldType = 'password';
  subscribedNumber: string;
  rememberMe = true;
  form: FormGroup;
  loading = false;
  errorMsg: string;
  USER_ERROR_MSG_BLOCKED = 'Votre Compte Orange et Moi a été bloqué. Cliquez sur mot de passe oublié et suivez les instructions.';
  navItems: {
    title: string;
    subTitle: string;
    action: 'help' | 'register' | 'password';
  }[] = [
    {
      title: 'Je m’inscris',
      subTitle: 'Pas encore de compte',
      action: 'register',
    },
    {
      title: 'J’ai besoin d’aide',
      subTitle: "J'ai des difficultés pour me connecter",
      action: 'help',
    },
    {
      title: 'J’ai oublié mon mot de passe',
      subTitle: 'Je le réinitialise',
      action: 'password',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog,
    private followAnalyticsService: FollowAnalyticsService,
    private navController: NavController,
    private modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.subscribedNumber, [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [this.rememberMe],
    });
  }

  processDirectLoginByDeeplink() {
    const username = this.route.snapshot.paramMap.get('username') || history?.state?.username;
    const password = this.route.snapshot.paramMap.get('password') || history?.state?.password;
    if (username && password) {
      this.form.patchValue({ username, password });
      this.UserLogin({ username, password });
    }
  }

  ionViewWillEnter() {
    this.getRegistrationInformation();
    ls.remove('light-token');
    this.processDirectLoginByDeeplink();
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
      () => {
        ls.remove('light-token');
        this.followAnalyticsService.registerEventFollow('login_success', 'event', user.username);
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
        this.followAnalyticsService.registerEventFollow('login_failed', 'error', { login: user.username, status: err.status });
        this.loading = false;
        this.showErrMessage = true;
        if (err && err.error.status === 400) {
          if (err.error.params !== '0' && err.error.params !== '-1') {
            this.errorMsg = err.error.title + ' ' + err.error.params + ' tentative' + (err.error.params === '1' ? '' : 's');
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

  changePasswordVisibility() {
    if (this.pFieldType === 'text') {
      this.pFieldType = 'password';
    } else {
      this.pFieldType = 'text';
    }
  }

  doAction(action: 'register' | 'help' | 'password') {
    if (action === 'register') {
      this.followAnalyticsService.registerEventFollow('Go_register_from_login', 'event');
      this.goRegisterPage();
    }
    if (action === 'help') {
      this.followAnalyticsService.registerEventFollow('Open_help_modal_from_login', 'event');
      this.openHelpModal(HelpModalDefaultContent);
    }
    if (action === 'password') {
      this.followAnalyticsService.registerEventFollow('Forgotten_pwd_from_login', 'event');
      this.navController.navigateRoot(FORGOT_PWD_PAGE_URL);
    }
  }

  async openHelpModal(sheetData?: any) {
    const modal = await this.modalController.create({
      component: CommonIssuesComponent,
      cssClass: 'besoin-daide-modal',
      componentProps: { data: sheetData },
    });
    return await modal.present();
  }

  goRegisterPage() {
    this.router.navigate(['new-registration']);
  }

  goIntro() {
    this.followAnalyticsService.registerEventFollow('Voir_Intro_from_login', 'event', 'clic');
    this.router.navigate(['/home']);
  }
  goBack() {
    this.navController.navigateBack(['/home']);
  }
}
