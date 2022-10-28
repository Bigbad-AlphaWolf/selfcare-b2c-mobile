import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
const ls = new SecureLS({ encodingType: 'aes' });
import { FORGOT_PWD_PAGE_URL, HelpModalDefaultContent } from 'src/shared';
import { CommonIssuesComponent } from 'src/shared/common-issues/common-issues.component';
import { NavController, ModalController } from '@ionic/angular';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';

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
    private router: Router,
    private authServ: AuthenticationService,
    private dashbServ: DashboardService,
    public dialog: MatDialog,
    private navController: NavController,
    private modalController: ModalController,
    private oemLogging: OemLoggingService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: [this.subscribedNumber, [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [this.rememberMe],
    });
  }

  ionViewWillEnter() {
    this.getRegistrationInformation();
    ls.remove('light-token');
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
    this.oemLogging.registerEvent('login_click');
  }

  UserLogin(user: any) {
    this.loading = true;
    this.authServ.login(user).subscribe(
      () => {
        ls.remove('light-token');
        this.oemLogging.registerEvent('login_success', [{ dataName: 'msisdn', dataValue: user.username }]);
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
        this.oemLogging.registerEvent('login_failed', [
          { dataName: 'login', dataValue: user.username },
          { dataName: 'status', dataValue: err.status },
        ]);
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
      this.oemLogging.registerEvent('Go_register_from_login');
      this.goRegisterPage();
    }
    if (action === 'help') {
      this.oemLogging.registerEvent('Open_help_modal_from_login');
      this.openHelpModal(HelpModalDefaultContent);
    }
    if (action === 'password') {
      this.oemLogging.registerEvent('login_reset_password_click', []);
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
    this.oemLogging.registerEvent('Voir_Intro_from_login');
    this.router.navigate(['/home']);
  }
  goBack() {
    this.navController.navigateBack(['/home']);
  }
}
