import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';
import { NavigationExtras, Router } from '@angular/router';
import { PalierModel } from '../models/palier.model';
import { IlliflexSetAmountModalComponent } from './components/illiflex-set-amount-modal/illiflex-set-amount-modal.component';
import { OPERATION_TYPE_PASS_ILLIFLEX } from 'src/shared';
import { BestOfferIlliflexModel } from '../models/best-offer-illiflex.model';
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
  constructor(
    private navController: NavController,
    private illiflexService: IlliflexService,
    private router: Router,
    private dashboardService: DashboardService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.getIlliflexPaliers();
  }

  getIlliflexPaliers() {
    this.illiflexService.getIlliflexPaliers().subscribe((res: any[]) => {
      this.paliers = res;
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
    this.getMaxDataVolumeOfAmount();
    this.getMinDataVolumeOfAmount();
    this.validity = this.getCurrentValidity();
    this.getBestOffer();
  }

  getBestOffer() {
    this.gettingBestOffer = true;
    const bestOfferPayload = {
      recipientMsisdn: this.dashboardService.getCurrentPhoneNumber(),
      amount: this.amount,
      validity: this.selectedPalier.validite,
    };
    this.illiflexService.getBestOffer(bestOfferPayload).subscribe(
      (bestOffer: BestOfferIlliflexModel) => {
        this.dataVolumeValue = bestOffer.dataBucket.balance.amount;
        this.gettingBestOffer = false;
      },
      (err) => {
        this.dataVolumeValue = this.minData;
        this.gettingBestOffer = false;
      }
    );
  }

  getMaxDataVolumeOfAmount() {
    this.maxData =
      (this.amount * 0.8) / (this.selectedPalier.dataPrice * 1.239);
  }

  getMinDataVolumeOfAmount() {
    this.minData =
      (this.amount * 0.2) / (this.selectedPalier.dataPrice * 1.239);
  }

  async openModalSetAmount() {
    const modal = await this.modalController.create({
      component: IlliflexSetAmountModalComponent,
      cssClass: 'select-recipient-modal',
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
      recipient: this.dashboardService.getCurrentPhoneNumber(),
    };
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: this.dashboardService.getCurrentPhoneNumber(),
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
}
