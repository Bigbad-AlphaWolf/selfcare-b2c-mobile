import {Subscription} from 'rxjs';
import {AppMinimize} from '@ionic-native/app-minimize/ngx';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {SubscriptionModel, hash53, isPrepaidOrHybrid, isPostpaidMobile, isPostpaidFix, isPrepaidFix, isKirene} from '.';
import {DashboardService} from '../services/dashboard-service/dashboard.service';
import {AuthenticationService} from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import {Router} from '@angular/router';
import {getCurrentDate, isNewVersion} from 'src/shared';
import {AssistanceService} from '../services/assistance.service';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {FollowAnalyticsService} from '../services/follow-analytics/follow-analytics.service';
import {Platform, NavController} from '@ionic/angular';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {AppUpdatePage} from '../pages/app-update/app-update.page';
import {map, take} from 'rxjs/operators';
import {PROFIL, CODE_CLIENT, CODE_FORMULE, FORMULE} from '../utils/constants';
import {BatchAnalyticsService} from '../services/batch-analytics/batch-analytics.service';
const ls = new SecureLS({encodingType: 'aes'});

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
  isIOS: boolean;
  appId: string;
  currentAppVersion: string;
  isFirebaseTokenSent = false;
  birthDateSubscription: Subscription;
  constructor(
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService,
    private assistanceService: AssistanceService,
    private router: Router,
    private followAnalyticsService: FollowAnalyticsService,
    private platform: Platform,
    private appMinimize: AppMinimize,
    private appVersion: AppVersion,
    private navCtl: NavController,
    private batch: BatchAnalyticsService
  ) {}

  ngOnInit() {
    if (this.platform.is('ios')) {
      this.isIOS = true;
      this.appId = 'orange-et-moi-sénégal/id1039327980';
    } else if (this.platform.is('android')) {
      this.appId = 'com.orange.myorange.osn';
    }
    this.dashboardServ.initScriptDimelo();
  }

  async checkForUpdate() {
    this.currentAppVersion = await this.appVersion.getVersionNumber();

    if (this.appId && this.currentAppVersion)
      this.assistanceService.getAppVersionPublished().subscribe((version: any) => {
        const versionAndroid = version.android;
        const versionIos = version.ios;
        if (versionAndroid || versionIos) {
          if (isNewVersion(this.isIOS ? versionIos : versionAndroid, this.currentAppVersion)) {
            this.navCtl.navigateForward([AppUpdatePage.ROUTE_PATH], {
              state: {appId: this.appId}
            });
          }
        }
      });
  }

  ngOnDestroy() {}

  ionViewWillEnter() {
    this.getCurrentSubscription();
    // if (!this.isFirebaseTokenSent) {
    //   this.authServ.UpdateNotificationInfo();
    //   this.isFirebaseTokenSent = true;
    // }
  }

  ionViewDidEnter() {
    // Initialize BackButton Eevent.
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      this.appMinimize.minimize();
    });
  }

  ionViewWillLeave() {
    this.backButtonSubscription.unsubscribe();
  }

  getCurrentSubscription() {
    const currentNumber = this.dashboardServ.getCurrentPhoneNumber();
    const date = getCurrentDate();
    this.hasErrorSubscription = false;
    this.isLoading = true;
    this.authServ
      .getSubscription(currentNumber)
      .pipe(
        map((rs: any) => {
          if (rs && rs.profil) {
            ls.set(PROFIL, rs.profil);
            ls.set(CODE_CLIENT, rs.clientCode);
            ls.set(CODE_FORMULE, rs.code);
            ls.set(FORMULE, rs.nomOffre);
          }
          return rs;
        })
      )
      .subscribe(
        (res: SubscriptionModel) => {
          this.isLoading = false;
          this.hasErrorSubscription = false;
          this.currentProfile = res.profil;
          this.currentFormule = res.nomOffre;
          this.currentCodeFormule = res.code;
          const souscription = res;
          let currentDashboard = '/dashboard';
          if (isPrepaidOrHybrid(souscription)) {
            currentDashboard = '/new-prepaid-hybrid-dashboard';
          } else if (isKirene(souscription)) {
            currentDashboard = '/dashboard-kirene';
          } else if (isPostpaidMobile(souscription)) {
            currentDashboard = '/dashboard-postpaid';
          } else if (isPostpaidFix(souscription)) {
            currentDashboard = '/dashboard-postpaid-fixe';
          } else if (isPrepaidFix(souscription)) {
            currentDashboard = '/dashboard-home-prepaid';
          }
          DashboardService.CURRENT_DASHBOARD = currentDashboard;
          this.saveAttachedNumbers();
          this.router.navigate([DashboardService.CURRENT_DASHBOARD]);
          this.checkForUpdate();
          this.followAnalyticsService.registerEventFollow('Dashboard_displayed', 'event', {
            msisdn: currentNumber,
            profil: this.currentProfile,
            formule: this.currentFormule,
            date
          });
          this.followAnalyticsService.setString('profil', this.currentProfile);
          this.followAnalyticsService.setString('formule', this.currentFormule);
          this.getUserInfosNlogBirthDateOnFollow();
          const user = ls.get('user');
          this.followAnalyticsService.setFirstName(user.firstName);
          this.followAnalyticsService.setLastName(user.lastName);
          const msisdn = this.authServ.getUserMainPhoneNumber();
          const hashedNumber = hash53(msisdn).toString();
          try {
            this.followAnalyticsService.registerId(hashedNumber);
            this.batch.registerID(hashedNumber);
          } catch (error) {
            this.batch.registerID(hashedNumber);
            this.followAnalyticsService.registerId(hashedNumber);
            this.followAnalyticsService.registerEventFollow('hash_error', 'error', error);
          }
        },
        (err: any) => {
          this.isLoading = false;
          this.hasErrorSubscription = true;
        }
      );
  }

  private saveAttachedNumbers() {
    DashboardService.rattachedNumbers = null;
    this.dashboardServ.attachedNumbers().pipe(take(1)).subscribe();
  }

  getUserInfosNlogBirthDateOnFollow() {
    const userInfosAlreadySet = !!ls.get('userInfos');
    if (!userInfosAlreadySet)
      this.dashboardServ.getCustomerInformations().subscribe(
        res => {
          this.followAnalyticsService.logUserBirthDate(res.birthDate);
        },
        err => {
          console.log(err);
        }
      );
  }
}
