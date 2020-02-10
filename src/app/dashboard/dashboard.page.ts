import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  PROFILE_TYPE_PREPAID,
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_POSTPAID,
  PROFILE_TYPE_HYBRID_1,
  KIRENE_Formule,
  PROFILE_TYPE_HYBRID_2,
  dashboardOpened,
  HOME_PREPAID_FORMULE,
  SubscriptionModel,
  hash53,
  isFixPostpaid,
  isFixPrepaid
} from '.';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { Router } from '@angular/router';
import { ShareSocialNetworkComponent } from 'src/shared/share-social-network/share-social-network.component';
import { MatDialog } from '@angular/material';
import { delay } from 'rxjs/operators';
import { ParrainageService } from '../services/parrainage-service/parrainage.service';
import { WelcomeStatusModel, getCurrentDate, CODE_KIRENE_Formule } from 'src/shared';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { BuyPassInternetPage } from '../buy-pass-internet/buy-pass-internet.page';
import { AssistancePage } from '../assistance/assistance.page';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
const ls = new SecureLS({ encodingType: 'aes' });

@AutoUnsubscribe()
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {
  userSubscription;
  opened = false;
  userInfos: any = {};
  firstName;
  lastName;
  currentProfile: string;
  currentFormule: string;
  currentCodeFormule;
  currentPhoneNumber = this.dashboardServ.getCurrentPhoneNumber();
  PROFILE_TYPE_PREPAID = PROFILE_TYPE_PREPAID;
  PROFILE_TYPE_HYBRID = PROFILE_TYPE_HYBRID;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  PROFILE_TYPE_HYBRID_1 = PROFILE_TYPE_HYBRID_1;
  PROFILE_TYPE_HYBRID_2 = PROFILE_TYPE_HYBRID_2;
  HOME_PREPAID_FORMULE = HOME_PREPAID_FORMULE;
  acceptCookie;
  hideCookie = true;
  fabOpened = false;
  isFormuleFixPrepaid = false;
  isFormuleFixPostpaid = false;
  hasErrorSubscription: boolean;
  isLoading: boolean;
  constructor(
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService,
    private assistanceService: AssistanceService,
    private router: Router,
    private shareDialog: MatDialog,
    private followAnalyticsService: FollowAnalyticsService
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

  showWelcomePopup(data: WelcomeStatusModel) {
    const dialog = this.shareDialog.open(WelcomePopupComponent, {
      data,
      panelClass: 'gift-popup-class'
    });
    dialog.afterClosed().subscribe(() => {
      this.assistanceService.tutoViewed().subscribe(() => {});
    });
  }

  getWelcomeStatus() {
    const number = this.dashboardServ.getMainPhoneNumber();
    this.dashboardServ.getAccountInfo(number).subscribe(
      (resp: any) => {
        ls.set('user', resp);
        if (!resp.tutoViewed) {
          this.dashboardServ.getWelcomeStatus().subscribe(
            (res: WelcomeStatusModel) => {
              if (res.status === 'SUCCESS') {
                this.showWelcomePopup(res);
              }
            },
            err => {}
          );
        }
      },
      () => {}
    );
  }

  ionViewWillEnter() {
    this.getCurrentSubscription();
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.getWelcomeStatus();
  }

  getCurrentSubscription() {
    const currentNumber = this.dashboardServ.getCurrentPhoneNumber();
    const date = getCurrentDate();
    this.hasErrorSubscription = false;
    this.isLoading = true;
    this.authServ
      .getSubscription(currentNumber)
      .subscribe((res: SubscriptionModel) => {
        this.isLoading = false;
        this.hasErrorSubscription = false;
        this.userSubscription = res;
        this.currentProfile = this.userSubscription.profil;
        this.currentFormule = this.userSubscription.nomOffre;
        this.currentProfile = res.profil;
        this.currentFormule = res.nomOffre;
        this.currentCodeFormule = res.code;
        dashboardOpened.next();
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
      (err:any)=>{
        this.isLoading = false;
        this.hasErrorSubscription = true;        
      });
    dashboardOpened.next();
    this.getWelcomeStatus();
  }

  getkIRENEFormule() {
    return CODE_KIRENE_Formule;
  }
  fabToggled() {
    this.fabOpened = !this.fabOpened;
  }
  goEmergencies() {
    this.router.navigate(['/control-center']);
  }
  public openSocialNetworkModal() {
    this.shareDialog.open(ShareSocialNetworkComponent, {
      height: '530px',
      width: '330px',
      maxWidth: '100%'
    });
  }

  ngOnDestroy() {}

  isFixPostpaid() {
    return isFixPostpaid(this.currentFormule);
  }

  isFixPrepaid() {
    return isFixPrepaid(this.currentFormule);
  }
}
