import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import {
  DashboardService,
  downloadAvatarEndpoint,
} from '../services/dashboard-service/dashboard.service';
import { AccountService } from '../services/account-service/account.service';
import * as SecureLS from 'secure-ls';
import {
  NO_AVATAR_ICON_URL,
  getNOAvatartUrlImage,
  ASSISTANCE_URL,
  CONSO,
  ASSISTANCE,
} from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { NavController } from '@ionic/angular';
import { OffresServicesPage } from '../pages/offres-services/offres-services.page';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
import { isPrepaidOrHybrid } from '../dashboard';
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
  numbers: any[] = [];
  @Input() currentAppVersion;

  constructor(
    private router: Router,
    private authServ: AuthenticationService,
    private dashboardServ: DashboardService,
    private accountService: AccountService,
    private iab: InAppBrowser,
    private followAnalyticsService: FollowAnalyticsService,
    private navCtrl: NavController,
    private appVersion: AppVersion,
    private socialSharing: SocialSharing,
    private appRout: ApplicationRoutingService,
    private bsService: BottomSheetService
  ) {}

  ngOnInit() {
    const userHasLogin = !!this.authServ.getToken();
    if (userHasLogin) {
      this.getSouscription();
      this.getAllAttachedNumbers();
      this.extractData();
    }
    this.dashboardServ.currentPhoneNumberChange.subscribe(() => {
      this.getSouscription();
      this.getAllAttachedNumbers();
      this.extractData();
    });
    this.authServ.currentPhoneNumbersubscriptionUpdated.subscribe(() => {
      this.getSouscription();
      this.getAllAttachedNumbers();
    });
    this.accountService.userUrlAvatarSubject.subscribe(() => {
      this.extractData();
    });
    this.getVersion();
    this.dashboardServ.attachedNumbersChanged.subscribe(() => {
      this.getAllAttachedNumbers();
    });
    this.accountService.deletedPhoneNumbersEmit().subscribe(() => {
      this.getAllAttachedNumbers();
    });
  }

  async getVersion() {
    this.currentAppVersion = await this.appVersion.getVersionNumber();
  }

  openModalRattachNumber() {
    this.bsService.openRattacheNumberModal();
  }

  getSouscription() {
    this.msisdn = this.dashboardServ.getCurrentPhoneNumber();
    const userHasLogin = !!this.authServ.getToken();
    if (userHasLogin) {
      setTimeout(() => {
        this.authServ.getSubscription(this.msisdn).subscribe((souscription) => {
          this.userSubscription = souscription;
          this.currentProfile = souscription.profil;
          this.currentFormule = souscription.nomOffre;
        });
      }, 1000);
    }
  }

  getAllAttachedNumbers() {
    this.numbers = [];
    this.dashboardServ.getAllOemNumbers().subscribe(
      (res) => {
        this.numbers = res;
        this.followAnalyticsService.registerEventFollow(
          'Recuperation_lignes_rattachees_menu_success',
          'event',
          this.msisdn
        );
      },
      (err) => {
        this.followAnalyticsService.registerEventFollow(
          'Recuperation_lignes_rattachees_menu_failed',
          'error',
          {
            msisdn: this.msisdn,
            error: err.status,
          }
        );
      }
    );
  }

  isActiveNumber(numberInfos) {
    return this.msisdn === numberInfos.msisdn;
  }

  goDetailsConso() {
    this.authServ.getSubscription(this.msisdn).subscribe((sub) => {
      if (isPrepaidOrHybrid(sub)) {
        this.followAnalyticsService.registerEventFollow(
          'Details_conso_tab_from_menu',
          'event',
          this.msisdn
        );
        this.dashboardServ.menuOptionClickEmit(CONSO);
        return;
      }
      this.followAnalyticsService.registerEventFollow(
        'Details_conso_menu',
        'event',
        this.msisdn
      );
      this.router.navigate(['/details-conso']);
    });
  }

  switchPhoneNumber(msisdn) {
    if (this.msisdn === msisdn) return;
    const mainMsisdn = this.dashboardServ.getMainPhoneNumber();
    this.followAnalyticsService.registerEventFollow(
      'Switch_msisdn_menu',
      'event',
      { main: mainMsisdn, msisdn }
    );
    this.dashboardServ.setCurrentPhoneNumber(msisdn);
    this.closeMenu();
    this.router.navigate(['/dashboard']);
  }

  attachLine() {
    this.followAnalyticsService.registerEventFollow(
      'Attach_msisdn_menu',
      'event'
    );
    this.router.navigate(['/new-number']);
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
    // this.router.navigate(['/community']);
    // return;
    this.iab.create(ASSISTANCE_URL, '_self');
    this.followAnalyticsService.registerEventFollow(
      'Sidemenu_Assistance',
      'event',
      'clicked'
    );
  }

  ngOnDestroy() {}

  onOffreClicked() {
    this.followAnalyticsService.registerEventFollow(
      'Offres_services_menu',
      'event'
    );
    this.navCtrl.navigateForward(OffresServicesPage.ROUTE_PATH);
  }

  goToMyOfferPlans() {
    this.followAnalyticsService.registerEventFollow('Bons_plans_menu', 'event');
    this.router.navigate(['/my-offer-plans']);
  }

  goFormule() {
    this.router.navigate(['/my-formule']);
    this.followAnalyticsService.registerEventFollow(
      'Ma_formule_menu',
      'event',
      'clicked'
    );
  }

  goFacture() {
    this.router.navigate(['/bills']);
    this.followAnalyticsService.registerEventFollow(
      'Factures_menu',
      'event',
      'clicked'
    );
  }

  goMyAccount() {
    this.router.navigate(['/my-account']);
    this.followAnalyticsService.registerEventFollow(
      'Mon_compte_menu',
      'event',
      'clicked'
    );
  }

  goParrainage() {
    this.router.navigate(['/parrainage']);
    this.followAnalyticsService.registerEventFollow(
      'Mes_parrainages_menu',
      'event',
      'clicked'
    );
  }

  goEmergencies() {
    this.authServ.getSubscription(this.msisdn).subscribe((sub) => {
      if (isPrepaidOrHybrid(sub)) {
        this.followAnalyticsService.registerEventFollow(
          'Assistance_tab_from_menu',
          'event',
          this.msisdn
        );
        this.dashboardServ.menuOptionClickEmit(ASSISTANCE);
        return;
      }
      this.router.navigate(['/assistance-hub']);
      this.followAnalyticsService.registerEventFollow(
        'Assistance_menu',
        'event',
        'clicked'
      );
    });
  }

  goToRattachedNumberPage() {
    this.appRout.goToRattachementsPage();
    this.followAnalyticsService.registerEventFollow(
      'Gérer_mes_lignes_menu',
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
    this.followAnalyticsService.registerEventFollow('A_propos_menu', 'event');
    this.router.navigate(['/apropos']);
  }

  defaulSharingSheet() {
    this.followAnalyticsService.registerEventFollow(
      'Partager_app_menu',
      'event'
    );
    const url = 'http://bit.ly/2NHn5aS';
    const postTitle =
      "Comme moi télécharge et connecte toi gratuitement sur l'application " +
      'Orange et Moi Fi rek la http://onelink.to/6h78t2 ou sur www.orangeetmoi.sn ' +
      'Bu ande ak simplicité ak réseau mo gën #WaawKay';
    const hashtag = '#WaawKay';

    this.socialSharing
      .share(postTitle, null, null, url)
      .then()
      .catch((err: any) => {
        console.log('Cannot open default sharing sheet' + err);
      });
  }
}
