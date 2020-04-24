import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import {
  DashboardService,
  downloadAvatarEndpoint,
} from '../services/dashboard-service/dashboard.service';
import { MatDialog } from '@angular/material';
import { AccountService } from '../services/account-service/account.service';
import * as SecureLS from 'secure-ls';
import {
  NO_AVATAR_ICON_URL,
  getNOAvatartUrlImage,
  ASSISTANCE_URL,
} from 'src/shared';
import { dashboardOpened } from '../dashboard';
const ls = new SecureLS({ encodingType: 'aes' });
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { FormuleService } from '../services/formule-service/formule.service';
@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
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
    private accountService: AccountService,
    private iab: InAppBrowser,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.getSouscription();
    this.extractData();
    this.dashboardServ.currentPhoneNumberChange.subscribe(() => {
      this.getSouscription();
      this.extractData();
    });
    this.authServ.currentPhoneNumbersubscriptionUpdated.subscribe((formule) => {
      console.log(formule);
      this.getSouscription();
    });
    this.accountService.userUrlAvatarSubject.subscribe(() => {
      this.extractData();
    });
  }

  getSouscription() {
    this.msisdn = this.dashboardServ.getCurrentPhoneNumber();
    const userHasLogin = !!this.authServ.getToken();
    if (userHasLogin) {
      this.authServ.getSubscription(this.msisdn).subscribe((souscription) => {
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
    this.iab.create(ASSISTANCE_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_Assistance',
      'event',
      'clicked'
    );
  }

  ngOnDestroy() {}

  launchInProgressPage() {
    this.accountService.launchInProgressPage();
  }

  goToMyOfferPlans() {
    this.router.navigate(['/my-offer-plans']);
  }

  goDashboard() {
    this.closeMenu();
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_Suivi_conso',
      'event',
      'clicked'
    );
  }

  goFormule() {
    this.router.navigate(['/my-formule']);
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_MaFormule',
      'event',
      'clicked'
    );
  }

  goFacture() {
    this.router.navigate(['/bills']);
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_Factures_Fixe_Mobile',
      'event',
      'clicked'
    );
  }

  goMyAccount() {
    this.router.navigate(['/my-account']);
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_Mon_Compte',
      'event',
      'clicked'
    );
  }

  goParrainage() {
    this.router.navigate(['/parrainage']);
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_Mes_Parrainages',
      'event',
      'clicked'
    );
  }

  goEmergencies() {
    this.router.navigate(['/control-center']);
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_urgences_depannages',
      'event',
      'clicked'
    );
  }

  changeCurrentNumber() {
    this.router.navigate(['/change-main-phone-number']);
    this.followAnalyticsService.registerEventFollow(
      'changer_de_ligne',
      'event',
      'clicked'
    );
  }

  setImgAvatarToDefault() {
    this.avatarUrl = getNOAvatartUrlImage();
  }

  closeMenu() {
    this.followAnalyticsService.registerEventFollow(
      'closed_menu',
      'event',
      'closed'
    );
    this.close.emit();
  }
  goToAbout() {
    this.router.navigate(['/apropos']);
  }
}
