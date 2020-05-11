import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import * as SecureLS from 'secure-ls';
import { ModalController } from '@ionic/angular';
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
    private followAnalyticsService: FollowAnalyticsService,
    private router: Router,
    private dashboardService: DashboardService,
    public modalController: ModalController
  ) {}

  ngOnInit() {}

  login() {
    this.logging = true;
    this.authService.login(this.userCredential).subscribe(
      (res) => {
        this.modalController.dismiss('logged in');
        this.dashboardService
          .getAccountInfo(this.userCredential.username)
          .subscribe(
            (resp: any) => {
              this.logging = false;
              ls.set('user', resp);
              this.router.navigate(['/dashboard']);
              this.followAnalyticsService.registerEventFollow(
                'Authentication_Successful',
                'event',
                this.userCredential.username
              );
            },
            () => {
              this.router.navigate(['/dashboard']);
              this.logging = false;
              this.followAnalyticsService.registerEventFollow(
                'Authentication_Failed',
                'error',
                this.userCredential.username
              );
            }
          );
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'Authentication_Failed',
          'error',
          this.userCredential.username
        );
        this.router.navigate(['/login']);
      }
    );
  }
}
