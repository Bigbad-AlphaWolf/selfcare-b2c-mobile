import { Component, OnInit } from '@angular/core';
import { GiftSargalCategoryItem, NO_AVATAR_ICON_URL, getLastUpdatedDateTimeText } from 'src/shared';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { DashboardService, downloadAvatarEndpoint } from '../services/dashboard-service/dashboard.service';
import { SargalService } from '../services/sargal-service/sargal.service';
import { SargalSubscriptionModel } from '../dashboard';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });
@Component({
  selector: 'app-sargal',
  templateUrl: './sargal.page.html',
  styleUrls: ['./sargal.page.scss']
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
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private dashbordServ: DashboardService,
    private sargalServ: SargalService
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
    const currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.sargalServ.getSargalBalance(currentNumber).subscribe(
      (res: SargalSubscriptionModel) => {
        this.sargalDataLoaded = true;
        if (res.status === 'SUBSCRIBED' || res.status === 'SUBSCRIPTION_ONGOING') {
          this.userSargalPoints = res.totalPoints;
          this.sargalLastUpdate = getLastUpdatedDateTimeText();

          const sargal = { sargalPts: this.userSargalPoints, lastUpdate: this.sargalLastUpdate };
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
  }
  goToPreviousStep() {}

  goToCataloguePage() {
    this.router.navigate(['/sargal-catalogue', 'all']);
  }

  goToCategorySargal(codeCategory: number) {
    this.router.navigate(['/sargal-catalogue', codeCategory]);
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
}
