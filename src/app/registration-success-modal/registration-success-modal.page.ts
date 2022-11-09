import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import * as SecureLS from 'secure-ls';
import { ModalController } from '@ionic/angular';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { convertObjectToLoggingPayload } from '../utils/utils';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-registration-success-modal',
  templateUrl: './registration-success-modal.page.html',
  styleUrls: ['./registration-success-modal.page.scss'],
})
export class RegistrationSuccessModalPage implements OnInit {
  logging: boolean;
  @Input() userCredential;
  constructor(
    private authService: AuthenticationService,
    private oemLoggingService: OemLoggingService,
    private router: Router,
    private dashboardService: DashboardService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  login() {
    this.logging = true;
    this.authService.login(this.userCredential).subscribe(
      res => {
        this.modalController.dismiss('logged in');
        this.dashboardService.getAccountInfo(this.userCredential.username).subscribe(
          (resp: any) => {
            this.logging = false;
            ls.set('user', resp);
            this.router.navigate(['/dashboard']);
            this.oemLoggingService.registerEvent('Post_register_login_successful', convertObjectToLoggingPayload({ username: this.userCredential.username }));
          },
          () => {
            this.router.navigate(['/dashboard']);
            this.logging = false;
            this.oemLoggingService.registerEvent('Post_register_login_failed', convertObjectToLoggingPayload({ username: this.userCredential.username }));
          }
        );
      },
      err => {
        this.oemLoggingService.registerEvent('Post_register_login_failed', convertObjectToLoggingPayload({ username: this.userCredential.username }));
        this.router.navigate(['/login']);
      }
    );
  }
}
