import { Component, OnInit } from '@angular/core';
import { GiftSargalCategoryItem, NO_AVATAR_ICON_URL, getLastUpdatedDateTimeText, SargalStatusModel } from 'src/shared';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService, downloadAvatarEndpoint } from '../services/dashboard-service/dashboard.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { SargalSubscriptionModel } from '../dashboard';
import * as SecureLS from 'secure-ls';
import { NavController } from '@ionic/angular';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-sargal',
  templateUrl: './sargal.page.html',
  styleUrls: ['./sargal.page.scss'],
})
export class SargalPage implements OnInit {
  currentProfile: string;
  avatarUrl: string;
  userInfos: any;
  sargalUnavailable: boolean;
  sargalUnsubscriptionInProgress: boolean;
  sargalPoints: number;
  sargalLastUpdate;
  noSargalAccount: boolean;
  sargalDataLoaded: boolean;
  showPartners: boolean;
  sargalCategories: GiftSargalCategoryItem[];
  userSargalPoints: number;
  dataLoaded: boolean;
  hasError: boolean;
  currentNumber: string;
  loadingStatus: boolean;
  sargalStatus: string;
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private dashbordServ: DashboardService,
    private sargalServ: SargalService,
    private navController: NavController,
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.showPartners = false;
    this.currentProfile = 'PREPAID';
    this.userInfos = this.authService.getLocalUserInfos();
    if (this.userInfos.imageProfil) {
      this.avatarUrl = downloadAvatarEndpoint + this.userInfos.imageProfil;
    } else {
      this.avatarUrl = NO_AVATAR_ICON_URL;
    }
    this.currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.sargalServ.getSargalBalance(this.currentNumber).subscribe(
      (res: SargalSubscriptionModel) => {
        this.sargalDataLoaded = true;
        if (res.status === 'SUBSCRIBED' || res.status === 'SUBSCRIPTION_ONGOING') {
          this.userSargalPoints = res.totalPoints;
          this.sargalLastUpdate = getLastUpdatedDateTimeText();

          const sargal = {
            sargalPts: this.userSargalPoints,
            lastUpdate: this.sargalLastUpdate,
          };
          ls.set('sargalPoints', sargal);
        }
      },
      (err: any) => {
        this.sargalDataLoaded = true;
        const data = ls.get('sargalPoints');
        if (data) {
          this.userSargalPoints = data.sargalPts;
          this.sargalLastUpdate = data.lastUpdate;
        }
      }
    );
    this.getCategories();
    this.getCustomerSargalStatus();
  }
  goToPreviousStep() {
    this.navController.pop();
  }

  goToCataloguePage() {
    this.oemLoggingService.registerEvent('hubsargal_all_gilfts_click', []);
    this.router.navigate(['/sargal-catalogue', 'all']);
  }

  goToCategorySargal(codeCategory: GiftSargalCategoryItem, pageTitle?: string) {
    let event = 'hubsargal_';
    switch (true) {
      case codeCategory.nom.toLowerCase().includes('minutes'):
        event += 'minutes_appels_click';
        break;
      case codeCategory.nom.toLowerCase().includes('internet'):
        event += 'pass_internet_click';
        break;
      case codeCategory.nom.toLowerCase().includes('illimix'):
        event += 'pass_illimix_click';
        break;
      case codeCategory.nom.toLowerCase().includes('sms'):
        event += 'sms_click';
        break;
      case codeCategory.nom.toLowerCase().includes('bons'):
        event += 'bons_click';
        break;
      case codeCategory.nom.toLowerCase().includes('illimité'):
        event += 'illimites_click';
        break;
    }
    this.oemLoggingService.registerEvent(event, [{ dataName: 'msisdn', dataValue: this.currentNumber }]);
    this.router.navigate(['/sargal-catalogue', codeCategory?.id]);
  }

  getCategories() {
    this.dataLoaded = false;
    this.hasError = false;
    this.sargalServ.querySargalGiftCategories().subscribe(
      (listCategory: GiftSargalCategoryItem[]) => {
        this.sargalCategories = listCategory;
        this.dataLoaded = true;
      },
      (err: any) => {
        this.hasError = true;
        this.dataLoaded = true;
      }
    );
  }

  getCustomerSargalStatus() {
    this.loadingStatus = true;
    this.sargalServ.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        if (sargalStatus.valid) {
          this.sargalStatus = sargalStatus.profilClient;
        }
        this.loadingStatus = false;
      },
      (err: any) => {
        this.loadingStatus = false;
      }
    );
  }

  goStatusSargal() {
    this.router.navigate(['/sargal-status-card']);
  }
}
