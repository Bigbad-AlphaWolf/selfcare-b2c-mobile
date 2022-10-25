import { Component, OnInit, EventEmitter, Output, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService, downloadAvatarEndpoint } from '../services/dashboard-service/dashboard.service';
import { AccountService } from '../services/account-service/account.service';
import * as SecureLS from 'secure-ls';
import { NO_AVATAR_ICON_URL, getNOAvatartUrlImage, ASSISTANCE_URL, CONSO, ASSISTANCE, SERVICES, isFixeNumber, JAMONO_NEW_SCOOL_CODE_FORMULE } from 'src/shared';
const ls = new SecureLS({ encodingType: 'aes' });
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { OffresServicesPage } from '../pages/offres-services/offres-services.page';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { BottomSheetService } from '../services/bottom-sheet/bottom-sheet.service';
import { isPrepaidOrHybrid } from '../dashboard';
import { OmStatusVisualizationComponent } from 'src/shared/om-status-visualization/om-status-visualization.component';
import { FACE_ID_PERMISSIONS, OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { FollowAnalyticsEventType } from '../services/follow-analytics/follow-analytics-event-type.enum';
import { OPERATION_TYPE_PAY_BILL, OPERATION_TYPE_TERANGA_BILL } from '../utils/operations.constants';
import { BonsPlansSargalService } from '../services/bons-plans-sargal/bons-plans-sargal.service';
import { tap } from 'rxjs/operators';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
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
  @Input() omUserInfos;
  displayPopUpOM = true;
  isBiometricAvailable: boolean;
  userBiometricStatus: FACE_ID_PERMISSIONS;
  FACE_ID_PERMISSION_ALLOWED = FACE_ID_PERMISSIONS.ALLOWED;
  FACE_ID_PERMISSION_DENIED = FACE_ID_PERMISSIONS.NEVER;
  SCOOL_CODE_FORMULE = JAMONO_NEW_SCOOL_CODE_FORMULE;
  @Input() showBonPlanSargal: boolean;

  constructor(
    private router: Router,
    private authServ: AuthenticationService,
    private bpSargalService: BonsPlansSargalService,
    private dashboardServ: DashboardService,
    private accountService: AccountService,
    private iab: InAppBrowser,
    private followAnalyticsService: FollowAnalyticsService,
    private navCtrl: NavController,
    private appVersion: AppVersion,
    private orangeMoneyServ: OrangeMoneyService,
    private appRout: ApplicationRoutingService,
    private bsService: BottomSheetService,
    private modalController: ModalController,
    private faio: FingerprintAIO,
    private platform: Platform,
    private oemLoggingService: OemLoggingService
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
    this.checkFingerprintAvailability();
  }

  getBonsPlansSargal() {
    this.bpSargalService
      .getBonsPlansSargal()
      .pipe(
        tap(bonPlanResponse => {
          this.showBonPlanSargal = !!bonPlanResponse?.length;
        })
      )
      .subscribe();
  }

  checkFingerprintAvailability() {
    this.userBiometricStatus = this.orangeMoneyServ.getFaceIdState();
    this.orangeMoneyServ.faceIdStatusChanged().subscribe((status: FACE_ID_PERMISSIONS) => {
      this.userBiometricStatus = status;
    });
    this.platform.ready().then(res => {
      this.faio
        .isAvailable()
        .then(faioType => {
          console.log(faioType);
          if (faioType) {
            this.isBiometricAvailable = true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }

  onChangedStatus(event) {
    if (event?.detail?.checked) {
      this.followAnalyticsService.registerEventFollow('Allow_Face_ID_Toggle', FollowAnalyticsEventType.EVENT, { msisdn: this.msisdn });
      this.orangeMoneyServ.allowFaceId();
    } else {
      this.followAnalyticsService.registerEventFollow('Disable_Face_ID_Toggle', FollowAnalyticsEventType.EVENT, { msisdn: this.msisdn });
      this.orangeMoneyServ.askFaceIdLater();
    }
  }

  async getVersion() {
    this.currentAppVersion = await this.appVersion.getVersionNumber();
  }

  openModalRattachNumber() {
    this.oemLoggingService.registerEvent('sidemenu_add_line', []);
    this.bsService.openRattacheNumberModal();
  }

  getSouscription() {
    this.msisdn = this.dashboardServ.getCurrentPhoneNumber();
    const userHasLogin = !!this.authServ.getToken();
    if (userHasLogin) {
      setTimeout(() => {
        this.authServ.getSubscription(this.msisdn).subscribe(souscription => {
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
      res => {
        this.numbers = res;
        this.followAnalyticsService.registerEventFollow('Recuperation_lignes_rattachees_menu_success', 'event', this.msisdn);
      },
      err => {
        this.followAnalyticsService.registerEventFollow('Recuperation_lignes_rattachees_menu_failed', 'error', {
          msisdn: this.msisdn,
          error: err.status,
        });
      }
    );
  }

  isActiveNumber(numberInfos) {
    return this.msisdn === numberInfos.msisdn;
  }

  goDetailsConso() {
    this.authServ.getSubscription(this.msisdn).subscribe(sub => {
      if (isPrepaidOrHybrid(sub)) {
        this.followAnalyticsService.registerEventFollow('Details_conso_tab_from_menu', 'event', this.msisdn);
        this.dashboardServ.menuOptionClickEmit(CONSO);
        return;
      }
      this.followAnalyticsService.registerEventFollow('Details_conso_menu', 'event', this.msisdn);
      this.router.navigate(['/details-conso']);
    });
  }

  switchPhoneNumber(msisdn) {
    if (this.msisdn === msisdn) return;
    const mainMsisdn = this.dashboardServ.getMainPhoneNumber();
    this.oemLoggingService.registerEvent('sidemenu_switch_line', [
      { dataName: 'mainMsisdn', dataValue: mainMsisdn },
      { dataName: 'msisdn', dataValue: msisdn },
    ]);
    this.dashboardServ.setCurrentPhoneNumber(msisdn);
    this.closeMenu();
    this.router.navigate(['/dashboard']);
  }

  attachLine() {
    this.followAnalyticsService.registerEventFollow('Attach_msisdn_menu', 'event');
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

  goBPSargal() {
    this.router.navigate(['/custom-sargal-profile']);
  }

  goToAssistancePage() {
    // return;
    this.iab.create(ASSISTANCE_URL, '_self');
    this.followAnalyticsService.registerEventFollow('Sidemenu_Assistance', 'event', 'clicked');
  }

  ngOnDestroy() {}

  onOffreClicked() {
    this.authServ.getSubscription(this.msisdn).subscribe(sub => {
      if (isPrepaidOrHybrid(sub)) {
        this.followAnalyticsService.registerEventFollow('services_tab_from_menu', 'event', this.msisdn);
        this.dashboardServ.menuOptionClickEmit(SERVICES);
        return;
      }
      this.followAnalyticsService.registerEventFollow('Offres_services_menu', 'event');
      this.navCtrl.navigateForward(OffresServicesPage.ROUTE_PATH);
    });
  }

  goToMyOfferPlans() {
    this.oemLoggingService.registerEvent('side_samay_sargal_click', []);
    this.router.navigate(['/my-offer-plans']);
  }

  goFormule() {
    this.oemLoggingService.registerEvent('sidemenu_formule_click', []);
    this.router.navigate(['/my-formule']);
  }

  goFacture() {
    const operationType = isFixeNumber(this.msisdn, this.userSubscription) ? OPERATION_TYPE_PAY_BILL : OPERATION_TYPE_TERANGA_BILL;
    this.router.navigate(['/bills'], {
      state: {
        operationType,
      },
    });
    this.oemLoggingService.registerEvent('Factures_menu_click', []);
  }

  goMyAccount() {
    this.oemLoggingService.registerEvent('sidemenu_edit_account_click', []);
    this.router.navigate(['/my-account']);
  }

  goParrainage() {
    this.oemLoggingService.registerEvent('sidemenu_parrainage_click', []);
    this.router.navigate(['/parrainage']);
  }

  goEmergencies() {
    this.authServ.getSubscription(this.msisdn).subscribe(sub => {
      if (isPrepaidOrHybrid(sub)) {
        this.followAnalyticsService.registerEventFollow('Assistance_tab_from_menu', 'event', this.msisdn);
        this.dashboardServ.menuOptionClickEmit(ASSISTANCE);
        return;
      }
      this.router.navigate(['/assistance-hub']);
      this.followAnalyticsService.registerEventFollow('Assistance_menu', 'event', 'clicked');
    });
  }

  goToRattachedNumberPage() {
    this.oemLoggingService.registerEvent('sidemenu_manage_lines_click', []);
    this.appRout.goToRattachementsPage();
  }

  setImgAvatarToDefault() {
    this.avatarUrl = getNOAvatartUrlImage();
  }

  closeMenu() {
    this.oemLoggingService.registerEvent('sidemenu_close_click', []);
    this.close.emit();
  }

  goToAbout() {
    this.oemLoggingService.registerEvent('sidemenu_informations_click', []);
    this.router.navigate(['/apropos']);
  }

  defaulSharingSheet() {
    this.oemLoggingService.registerEvent('sidemenu_share_app_click', []);
    this.bsService.defaulSharingSheet();
  }

  async openOMStatus() {
    this.oemLoggingService.registerEvent('sidemenu_grade_om_click', []);
    const modal = await this.modalController.create({
      component: OmStatusVisualizationComponent,
      cssClass: 'select-recipient-modal',
    });
    return await modal.present();
  }

  closePopUpOM() {
    this.displayPopUpOM = false;
  }

  getUserOMInfos() {
    console.log('omInfos', this.orangeMoneyServ.GetOrangeMoneyUser(this.dashboardServ.getCurrentPhoneNumber()));
  }

  goToSatisfactionForm() {
    this.router.navigate(['/satisfaction-form']);
    this.followAnalyticsService.registerEventFollow('Ibou_Formulaire_de_satisfaction_clic', 'event', 'clicked');
  }
}
