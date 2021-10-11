import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';
import { NavigationExtras, Router } from '@angular/router';
import { PalierModel } from '../models/palier.model';
import { IlliflexSetAmountModalComponent } from './components/illiflex-set-amount-modal/illiflex-set-amount-modal.component';
import {
  CODE_KIRENE_Formule,
  OPERATION_TYPE_PASS_ILLIFLEX,
  SubscriptionModel,
} from 'src/shared';
import { BestOfferIlliflexModel } from '../models/best-offer-illiflex.model';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { PROFILE_TYPE_PREPAID } from '../dashboard';
const BASE_MULTIPLE = 5;
@Component({
  selector: 'app-illiflex-budget-configuration',
  templateUrl: './illiflex-budget-configuration.page.html',
  styleUrls: ['./illiflex-budget-configuration.page.scss'],
})
export class IlliflexBudgetConfigurationPage implements OnInit {
  // different paliers set in admin
  paliers: PalierModel[] = [];
  // selected palier depending on amount
  selectedPalier: PalierModel;
  // corresponding quantity of data in Mo
  dataVolumeValue: number = 0;
  // corresponding quantity of voice in minuts
  voiceQuantityValue: number = 0;
  // amount set by customer
  amount: number;
  // validity of illiflex
  validity: string;
  // title of page recap depending on validity
  illiflexTitle: string;
  // max data volume
  maxData: number = 0;
  // min data volume
  minData: number = 0;
  // percentage of total amount invested in data
  dataSegmentation: number;
  // boolean to get bestOffer
  gettingBestOffer: boolean;
  recipientMsisdn: string;
  recipientOfferCode: string;
  bonusSms: number;
  BASE_MULTIPLE = BASE_MULTIPLE;
  maxAmountIlliflex = 15000;
  minAmountIlliflex = 500;
  constructor(
    private navController: NavController,
    private illiflexService: IlliflexService,
    private router: Router,
    private dashboardService: DashboardService,
    private authenticationService: AuthenticationService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getIlliflexPaliers();
    if (
      this.router.url &&
      this.router.url.match('/illiflex-budget-configuration')
    ) {
      let payload = this.router.getCurrentNavigation().extras.state.payload;
      payload = payload ? payload : history.state;
      if (payload) {
        this.recipientMsisdn = payload.recipientMsisdn;
        this.recipientOfferCode = payload?.code;
      }
    } else {
      this.checkIfDeeplink();
    }
  }

  async checkIfDeeplink() {
    const msisdn = this.dashboardService.getCurrentPhoneNumber();
    const sub: SubscriptionModel = await this.authenticationService
      .getSubscription(msisdn)
      .toPromise();
    if (
      sub &&
      (sub?.code === CODE_KIRENE_Formule || sub.profil !== PROFILE_TYPE_PREPAID)
    ) {
      this.router.navigate(['/dashboard']);
    } else {
      this.recipientMsisdn = msisdn;
      this.recipientOfferCode = sub?.code;
    }
  }

  getIlliflexPaliers() {
    this.illiflexService.getIlliflexPaliers().subscribe((res: any[]) => {
      this.paliers = res;
      this.getMinAndMax();
    });
  }

  goBack() {
    this.navController.pop();
  }

  onAmountChanged() {
    this.selectedPalier = this.paliers.find(
      (palier) =>
        this.amount >= palier.minPalier && this.amount <= palier.maxPalier
    );
    this.bonusSms = this.selectedPalier.bonusSms;
    this.getMaxDataVolumeOfAmount();
    this.getMinDataVolumeOfAmount();
    this.validity = this.getCurrentValidity();
    this.getBestOffer();
  }

  getBestOffer() {
    this.gettingBestOffer = true;
    const bestOfferPayload = {
      recipientMsisdn: this.recipientMsisdn,
      amount: this.amount,
      validity: this.selectedPalier.validite,
    };
    this.illiflexService.getBestOffer(bestOfferPayload).subscribe(
      (bestOffer: BestOfferIlliflexModel) => {
        this.dataVolumeValue = this.roundDataVolumeBestOffer(
          bestOffer.dataBucket.balance.amount
        );
        this.gettingBestOffer = false;
      },
      (err) => {
        this.dataVolumeValue = this.minData;
        this.gettingBestOffer = false;
      }
    );
  }

  roundDataVolumeBestOffer(dataVolume) {
    let volumeData: number;
    if (dataVolume > this.maxData) {
      volumeData = this.maxData;
    } else if (dataVolume < this.minData) {
      volumeData = this.minData;
    } else {
      volumeData = Math.round(dataVolume / BASE_MULTIPLE) * BASE_MULTIPLE;
    }
    return volumeData;
  }

  getMaxDataVolumeOfAmount() {
    const maxData =
      (this.amount * 0.8) / (this.selectedPalier.dataPrice * 1.239);
    // round it to nearest and smallest multiple of 5
    this.maxData = Math.floor(maxData / BASE_MULTIPLE) * BASE_MULTIPLE;
  }

  getMinDataVolumeOfAmount() {
    const minData =
      (this.amount * 0.2) / (this.selectedPalier.dataPrice * 1.239);
    // round it to nearest and biggest multiple of 5
    this.minData = Math.ceil(minData / BASE_MULTIPLE) * BASE_MULTIPLE;
  }

  async openModalSetAmount() {
    const modal = await this.modalController.create({
      component: IlliflexSetAmountModalComponent,
      cssClass: 'select-recipient-modal',
      componentProps: { pricings: this.paliers },
    });
    modal.onDidDismiss().then((response) => {
      if (response && response.data) {
        this.amount = response.data;
        this.onAmountChanged();
      }
    });
    return await modal.present();
  }

  onGaugeChanged() {
    if (!this.selectedPalier) return;
    const dataPrice =
      this.dataVolumeValue * this.selectedPalier.dataPrice * 1.239;
    this.dataSegmentation = dataPrice / this.amount;
    const voicePrice = this.amount - dataPrice;
    this.voiceQuantityValue =
      voicePrice / (this.selectedPalier.voicePrice * 1.239);
  }

  goRecapPage() {
    const pass = {
      data: this.dataVolumeValue,
      amount: this.amount,
      voice: this.voiceQuantityValue,
      validity: this.selectedPalier.validite,
      recipient: this.recipientMsisdn,
      sender: this.dashboardService.getCurrentPhoneNumber(),
      recipientOfferCode: this.recipientOfferCode,
      bonusSms: this.bonusSms,
    };
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: this.recipientMsisdn,
        amount: this.amount,
        purchaseType: OPERATION_TYPE_PASS_ILLIFLEX,
        title: this.illiflexTitle,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }

  getCurrentValidity() {
    switch (this.selectedPalier.validite) {
      case 'Jour':
        this.illiflexTitle = 'Achat illiflex 24 heures';
        return '24 heures';
      case 'Semaine':
        this.illiflexTitle = 'Achat illiflex 7 jours';
        return '7 jours';
      case 'Mois':
        this.illiflexTitle = 'Achat illiflex 30 jours';
        return '30 jours';
    }
  }

  getMinAndMax() {
    if (!this.paliers && !this.paliers.length) return;
    const maxArray = this.paliers.map((pricing) => pricing.maxPalier);
    this.maxAmountIlliflex = Math.max(...maxArray);
    const minArray = this.paliers.map((pricing) => pricing.minPalier);
    this.minAmountIlliflex = Math.min(...minArray);
  }
}
