import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  PROFILE_TYPE_PREPAID,
  PROFILE_TYPE_HYBRID,
  PROFILE_TYPE_POSTPAID,
  PROFILE_TYPE_HYBRID_1,
  KIRENE_Formule,
  PROFILE_TYPE_HYBRID_2
} from '.';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import * as SecureLS from 'secure-ls';
import { Router } from '@angular/router';
import { ShareSocialNetworkComponent } from 'src/shared/share-social-network/share-social-network.component';
import { MatDialog } from '@angular/material';
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
  dashboardOpened: Subscription;

  constructor(
    private dashboardServ: DashboardService,
    private authServ: AuthenticationService,
    private router: Router,
    private shareDialog: MatDialog
  ) {}

  ngOnInit() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.authServ
      .getSubscription(this.currentPhoneNumber)
      .subscribe((userSubscription: any) => {
        this.userSubscription = userSubscription;
        this.currentProfile = userSubscription.profil;
        this.currentFormule = userSubscription.nomOffre;
      });
  }

  ionViewDidEnter() {
    console.log('entered');
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
