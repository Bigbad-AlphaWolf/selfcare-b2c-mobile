import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService, downloadAvatarEndpoint } from '../services/dashboard-service/dashboard.service';
import { MatDialog } from '@angular/material';
import { AccountService } from '../services/account-service/account.service';
import * as SecureLS from 'secure-ls';
import { NO_AVATAR_ICON_URL, getNOAvatartUrlImage, ASSISTANCE_URL } from 'src/shared';
import { dashboardOpened } from '../dashboard';
const ls = new SecureLS({ encodingType: 'aes' });
declare var FollowAnalytics: any;
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SidemenuComponent implements OnInit, OnDestroy {
  userSubscription;
  userInfos;
  @Output() close = new EventEmitter();
  firstName;
  lastName;
  currentProfile;
  currentFormule;
  msisdn = this.dashboardServ.getCurrentPhoneNumber();
  avatarUrl: string;

  constructor(
    private router: Router,
    private authServ: AuthenticationService,
    private dashboardServ: DashboardService,
    public dialog: MatDialog,
    private accountService: AccountService
  ) {}

  ngOnInit() {
    this.getSouscription();
    this.extractData();
    this.dashboardServ.currentPhoneNumberChange.subscribe(() => {
      this.getSouscription();
      this.extractData();
    });
    this.accountService.userUrlAvatarSubject.subscribe(() => {
      this.extractData();
    });
    dashboardOpened.subscribe(x => {
      this.getSouscription();
    });
  }

  getSouscription() {
    this.msisdn = this.dashboardServ.getCurrentPhoneNumber();
    const userHasLogin = !!this.authServ.getToken();
    if (userHasLogin) {
      this.authServ.getSubscription(this.msisdn).subscribe(souscription => {
        this.userSubscription = souscription;
        this.currentProfile = souscription.profil;
        this.currentFormule = souscription.nomOffre;
      });
    }
  }

  extractData() {
    this.userInfos = ls.get('user');
    if (this.userInfos.imageProfil) {
      this.avatarUrl = downloadAvatarEndpoint + this.userInfos.imageProfil;
    } else {
      this.avatarUrl = NO_AVATAR_ICON_URL;
    }
    if (this.userSubscription) {
      this.currentProfile = this.userSubscription.profil;
      this.currentFormule = this.userSubscription.nomOffre;
    }
    this.getUserNames();
  }

  getUserNames() {
    const user = ls.get('user');
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  goToAssistancePage() {
    window.open(ASSISTANCE_URL);
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_Assistance', 'clicked');
    }
  }

  ngOnDestroy() {}

  launchInProgressPage() {
    this.accountService.launchInProgressPage();
  }

  goDashboard() {
    this.closeMenu();
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_Suivi_conso', 'clicked');
    }
  }

  goFormule() {
    this.router.navigate(['/my-formule']);
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_MaFormule', 'clicked');
    }
  }

  goFacture() {
    this.router.navigate(['/bills']);
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_Factures_Fixe_Mobile', 'clicked');
    }
  }

  goMyAccount() {
    this.router.navigate(['/my-account']);
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_Mon_Compte', 'clicked');
    }
  }

  goEmergencies() {
    this.router.navigate(['/control-center']);
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_urgences_depannages', 'clicked');
    }
  }

  changeCurrentNumber() {
    this.router.navigate(['/change-main-phone-number']);
    if (typeof FollowAnalytics !== 'undefined') {
      FollowAnalytics.logEvent('Sidemenu_urgences_depannages', 'clicked');
    }
  }

  setImgAvatarToDefault() {
    this.avatarUrl = getNOAvatartUrlImage();
  }

  closeMenu() {
    this.close.emit();
  }
  goToAbout() {
    this.router.navigate(['/apropos']);
  }
}
