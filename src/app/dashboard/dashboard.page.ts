import { Component, OnInit } from '@angular/core';
import {
  PROFILE_TYPE_PREPAID,
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_POSTPAID,
  PROFILE_TYPE_HYBRID_1,
  KIRENE_Formule,
  PROFILE_TYPE_HYBRID_2,
  dashboardOpened
} from '.';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { Router } from '@angular/router';
import { ShareSocialNetworkComponent } from 'src/shared/share-social-network/share-social-network.component';
import { MatDialog } from '@angular/material';
import { delay } from 'rxjs/operators';
import { ParrainageService } from '../services/parrainage-service/parrainage.service';
import { WelcomeStatusModel } from 'src/shared';
import { WelcomePopupComponent } from 'src/shared/welcome-popup/welcome-popup.component';
import { AssistanceService } from '../services/assistance.service';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {
  userSubscription;
  opened = false;
  userInfos: any = {};
  firstName;
  lastName;
  currentProfile;
  currentFormule;
  currentPhoneNumber = this.dashboardServ.getCurrentPhoneNumber();
  PROFILE_TYPE_PREPAID = PROFILE_TYPE_PREPAID;
  PROFILE_TYPE_HYBRID = PROFILE_TYPE_HYBRID;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  PROFILE_TYPE_HYBRID_1 = PROFILE_TYPE_HYBRID_1;
  PROFILE_TYPE_HYBRID_2 = PROFILE_TYPE_HYBRID_2;
  acceptCookie;
  hideCookie = true;
  fabOpened = false;

  constructor(
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService,
    private parrainageService: ParrainageService,
    private assistanceService: AssistanceService,
    private router: Router,
    private shareDialog: MatDialog
  ) {}

  ngOnInit() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
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
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.currentPhoneNumber = this.dashboardServ.getCurrentPhoneNumber();
    this.authServ
      .getSubscription(this.currentPhoneNumber)
      .subscribe((userSubscription: any) => {
        this.userSubscription = userSubscription;
        this.currentProfile = userSubscription.profil;
        this.currentFormule = userSubscription.nomOffre;
      });
    dashboardOpened.next();
    this.parrainageService.isSponsor().subscribe(res => {}, err => {});
    this.getWelcomeStatus();
  }

  getkIRENEFormule() {
    return KIRENE_Formule;
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
}
