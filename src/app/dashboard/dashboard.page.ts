import { Subscription } from 'rxjs';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  SubscriptionModel,
  hash53,
  isPrepaidOrHybrid,
  isPostpaidMobile,
  isPostpaidFix,
  isPrepaidFix,
  isKirene,
  dashboardOpened,
  isFixPostpaid,
  isFixPrepaid
} from '.';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { getCurrentDate } from 'src/shared';
import { AssistanceService } from '../services/assistance.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { Platform } from '@ionic/angular';
const ls = new SecureLS({ encodingType: 'aes' });

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {
  userSubscription;
  currentProfile: string;
  currentFormule: string;
  currentCodeFormule;
  currentPhoneNumber = this.dashboardServ.getCurrentPhoneNumber();
  opened = false;
  fabOpened = false;
  hasErrorSubscription: boolean;
  isLoading: boolean;
  backButtonSubscription: Subscription;
  firstName: any;
  lastName: any;
  isFormuleFixPostpaid: any;
  isFormuleFixPrepaid: any;
  constructor(
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService,
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private platform: Platform,
    private appMinimize: AppMinimize
  ) {}

  ngOnInit() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;

    dashboardOpened.subscribe(x => {
      this.isFormuleFixPostpaid = isFixPostpaid(this.currentFormule);
      this.isFormuleFixPrepaid = isFixPrepaid(this.currentFormule);
    });

  }
  ionViewDidEnter() {
    // Initialize BackButton Eevent.
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.appMinimize.minimize();
    });
  }

  ionViewWillLeave() { this.backButtonSubscription.unsubscribe(); }

  ngOnDestroy() {}

  ionViewWillEnter() {
    this.getCurrentSubscription();
  }

  getCurrentSubscription() {
    const currentNumber = this.dashboardServ.getCurrentPhoneNumber();
    const date = getCurrentDate();
    this.hasErrorSubscription = false;
    this.isLoading = true;
    this.authServ.getSubscription(currentNumber).subscribe(
      (res: SubscriptionModel) => {
        this.isLoading = false;
        this.hasErrorSubscription = false;
        this.userSubscription = res;
        this.currentProfile = this.userSubscription.profil;
        this.currentFormule = this.userSubscription.nomOffre;
        this.currentProfile = res.profil;
        this.currentFormule = res.nomOffre;
        this.currentCodeFormule = res.code;
        const souscription = {
          profil: this.currentProfile,
          formule: this.currentFormule,
          codeFormule: this.currentCodeFormule
        };
        if (isPrepaidOrHybrid(souscription)) {          
          this.router.navigate(['/dashboard-prepaid-hybrid']);
        } else if (isKirene(souscription)) {
          this.router.navigate(['/dashboard-kirene']);
        } else if (isPostpaidMobile(souscription)) {
          this.router.navigate(['/dashboard-postpaid']);
        } else if (isPostpaidFix(souscription)) {
          this.router.navigate(['/dashboard-postpaid-fixe']);
        } else if (isPrepaidFix(souscription)) {
          this.router.navigate(['/dashboard-home-prepaid']);
        }
        this.followAnalyticsService.registerEventFollow('dashboard', 'event', {
          msisdn: currentNumber,
          profil: this.currentProfile,
          formule: this.currentFormule,
          date
        });
        this.followAnalyticsService.setString('profil', this.currentProfile);
        this.followAnalyticsService.setString('formule', this.currentFormule);
        const user = ls.get('user');
        this.followAnalyticsService.setFirstName(user.firstName);
        this.followAnalyticsService.setLastName(user.lastName);
        const msisdn = this.authServ.getUserMainPhoneNumber();
        const hashedNumber = hash53(msisdn).toString();
        try {
          this.followAnalyticsService.registerId(hashedNumber);
        } catch (error) {
          this.followAnalyticsService.registerId(hashedNumber);
          this.followAnalyticsService.registerEventFollow(
            'hash_error',
            'error',
            error
          );
        }
      },
      (err: any) => {
        this.isLoading = false;
        this.hasErrorSubscription = true;
      }
    );
  }
}
