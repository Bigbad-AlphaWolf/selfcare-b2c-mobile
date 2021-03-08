import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { PassInternetService } from '../../services/pass-internet-service/pass-internet.service';
import {
  arrangePassByCategory,
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  CODE_KIRENE_Formule,
  ERROR_MSG_PASS,
  OPERATION_TYPE_PASS_ALLO,
  getActiveBoostersForSpecificPass,
} from 'src/shared';
import { PassIllimixService } from '../../services/pass-illimix-service/pass-illimix.service';
import { BoosterService } from 'src/app/services/booster.service';
import { BoosterModel, BoosterTrigger } from 'src/app/models/booster.model';

@Component({
  selector: 'app-liste-pass',
  templateUrl: './liste-pass.page.html',
  styleUrls: ['./liste-pass.page.scss'],
})
export class ListePassPage implements OnInit {
  static ROUTE_PATH: string = '/list-pass';
  slideSelected = 1;
  userNumber: string;
  userCodeFormule: string;
  listCategory = [];
  listPass: any;
  isLoaded: boolean;
  activeTabIndex = 0;
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  fullListPass: { label: string; pass: any[] }[];
  recipientName: string;
  purchaseType: string;
  isLightMod: boolean;
  OPERATION_INTERNET_TYPE = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_ILLIMIX_TYPE = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_ALLO_TYPE = OPERATION_TYPE_PASS_ALLO;
  boosters: BoosterModel[] = [];
  constructor(
    private router: Router,
    private passIntService: PassInternetService,
    private passIllimixServ: PassIllimixService,
    private boosterService: BoosterService,
    private navCtl: NavController
  ) {}

  ngOnInit() {
    // this.route.queryParams.subscribe((params) => {
    // if (
    //   this.router.getCurrentNavigation().extras.state &&
    //   this.router.getCurrentNavigation().extras.state.payload
    // ) {
    if (this.router) {
      let payload = this.router.getCurrentNavigation().extras.state.payload;
      payload = payload ? payload : history.state;
      this.isLightMod = payload.isLightMod;
      this.userNumber = payload.destinataire;
      this.userCodeFormule = payload.code;
      this.recipientName = payload.recipientName;
      this.purchaseType = payload.purchaseType;
      this.listCategory = [];
      this.listPass = [];
      this.activeTabIndex = 0;
      let boosterPayload = {
        trigger: null,
        codeFormuleRecipient: this.userCodeFormule,
        msisdn: this.userNumber,
      };
      if (this.purchaseType === OPERATION_TYPE_PASS_INTERNET) {
        boosterPayload.trigger = BoosterTrigger.PASS_INTERNET;
        this.passIntService.setUserCodeFormule(this.userCodeFormule);
        this.passIntService
          .queryListPassInternetOfUser(this.userCodeFormule, this.isLightMod)
          .subscribe(
            () => {
              this.isLoaded = true;
              this.listCategory = this.passIntService.getListCategoryPassInternet();
              this.listPass = this.passIntService.getListPassInternetOfUser();
              if (this.isLightMod) {
                this.filterPassForLightMod();
              }
              this.fullListPass = arrangePassByCategory(
                this.listPass,
                this.listCategory
              );
            },
            () => {
              this.isLoaded = true;
            }
          );
      } else {
        boosterPayload.trigger = BoosterTrigger.PASS_ILLIMIX;
        const category =
          this.purchaseType === OPERATION_TYPE_PASS_ALLO ? 'allo' : null;
        this.passIllimixServ
          .queryListPassIllimix(this.userCodeFormule, category, this.isLightMod)
          .subscribe(
            () => {
              this.isLoaded = true;
              this.listCategory = this.passIllimixServ.getCategoryListPassIllimix();
              this.listPass = this.passIllimixServ.getListPassIllimix();
              if (this.isLightMod) {
                this.filterPassForLightMod();
              }
              this.fullListPass = arrangePassByCategory(
                this.listPass,
                this.listCategory
              );
            },
            () => {
              this.isLoaded = true;
            }
          );
      }
      this.boosterService.getBoosters(boosterPayload).subscribe((boosters) => {
        this.boosters = boosters;
        BoosterService.lastBoostersList = boosters;
      });
    }
  }

  getPassBoosters(pass: any) {
    return getActiveBoostersForSpecificPass(pass, this.boosters);
  }

  // filter listPass with pass with price_plan_index credit set
  filterPassForLightMod() {
    this.listPass = this.listPass.filter((pass) => {
      return (
        (pass && pass.price_plan_index) ||
        (pass.passParent && pass.passParent.price_plan_index)
      );
    });
  }

  changeCategory(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
  }

  slideChanged() {
    this.sliders.getActiveIndex().then((index) => {
      this.activeTabIndex = index;
    });
  }

  goBack() {
    this.navCtl.pop();
  }

  choosePass(pass: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: this.userNumber,
        recipientCodeFormule: this.userCodeFormule,
        recipientName: this.recipientName,
        purchaseType: this.purchaseType,
        isLightMod: this.isLightMod,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }

  getErrorMessageNoPass() {
    if (this.userCodeFormule === CODE_KIRENE_Formule) {
      return ERROR_MSG_PASS.LIST_EMPTY_FOR_KIRENE;
    }
    return ERROR_MSG_PASS.LIST_EMPTY;
  }
}
