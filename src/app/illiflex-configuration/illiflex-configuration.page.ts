import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  getMaxDataVolumeOrVoiceOfPaliers,
  getMinDataVolumeOrVoiceOfPaliers,
  OPERATION_TYPE_PASS_ILLIFLEX,
} from 'src/shared';
import { DataVolumePipe } from 'src/shared/pipes/data-volume.pipe';
import { IlliflexVoicePipe } from 'src/shared/pipes/illiflex-voice.pipe';
import { PalierModel } from '../models/palier.model';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { IlliflexService } from '../services/illiflex-service/illiflex.service';

@Component({
  selector: 'app-illiflex-configuration',
  templateUrl: './illiflex-configuration.page.html',
  styleUrls: ['./illiflex-configuration.page.scss'],
})
export class IlliflexConfigurationPage implements OnInit {
  // all paliers from all validities
  paliers: PalierModel[] = [];
  // all paliers with the selected validity by user
  currentPaliers: PalierModel[] = [];
  // selected palier to calculate data
  selectedDataPalier: PalierModel;
  // selected palier to calculate voice
  selectedVoicePalier: PalierModel;
  // different paliers validities
  validities: string[] = [];
  // corresponding quantity of data in Mo
  dataVolumeValue: number = 0;
  // corresponding quantity of voice in minuts
  voiceQuantityValue: number = 0;
  validityMinPrice: number = 0;
  validityMaxPrice: number = 0;

  maxDataVolume: number = 0;
  minDataVolume: number = 0;
  maxVoice: number = 0;
  minVoice: number = 0;
  // illiflex amount
  totalPrice = 0;
  illiflexTitle: string;
  illiflexValidity: string;
  constructor(
    private navController: NavController,
    private illiflexService: IlliflexService,
    private router: Router,
    private dashboardService: DashboardService,
    private dataVolumePipe: DataVolumePipe,
    private illiflexVoicePipe: IlliflexVoicePipe
  ) {}

  ngOnInit() {
    this.getIlliflexPaliers();
  }

  getIlliflexPaliers() {
    this.illiflexService.getIlliflexPaliers().subscribe((res: any[]) => {
      this.paliers = res;
      this.validities = [
        ...new Set(this.paliers.map((palier) => palier.validite)),
      ];
    });
  }

  goBack() {
    this.navController.pop();
  }

  onValidityChanged(validity) {
    this.currentPaliers = this.paliers
      .filter((palier) => palier.validite === validity)
      .sort((palier1, palier2) => palier2.maxPalier - palier1.maxPalier);
    this.selectedDataPalier = this.currentPaliers[0];
    this.selectedVoicePalier = this.currentPaliers[0];
    this.getMaxMinBudgetOfPaliers();
    this.getMaxMinOfDataAndVoice();
    this.illiflexValidity = validity;
    switch (validity) {
      case 'Jour':
        this.illiflexTitle = 'Achat illiflex 24 heures';
        break;
      case 'Semaine':
        this.illiflexTitle = 'Achat illiflex 7 jours';
        break;
      case 'Mois':
        this.illiflexTitle = 'Achat illiflex 30 jours';
        break;
      default:
        break;
    }
  }

  getMaxMinBudgetOfPaliers() {
    this.validityMaxPrice = Math.max(
      ...this.currentPaliers.map((palier) => palier.maxPalier)
    );
    this.validityMinPrice = Math.min(
      ...this.currentPaliers.map((palier) => palier.minPalier)
    );
  }

  getMaxMinOfDataAndVoice() {
    this.maxDataVolume = getMaxDataVolumeOrVoiceOfPaliers(
      this.currentPaliers,
      'data'
    );
    this.minDataVolume = getMinDataVolumeOrVoiceOfPaliers(
      this.currentPaliers,
      'data'
    );
    this.maxVoice = getMaxDataVolumeOrVoiceOfPaliers(
      this.currentPaliers,
      'voice'
    );
    this.minVoice = getMinDataVolumeOrVoiceOfPaliers(
      this.currentPaliers,
      'voice'
    );
    this.dataVolumeValue = this.minDataVolume;
    this.voiceQuantityValue = this.minVoice;
  }

  roundValue(decimal: number) {
    return Math.round(decimal * 100) / 100;
  }

  onVoiceGaugeChanged() {
    this.selectedVoicePalier = this.currentPaliers.find(
      (palier) =>
        this.voiceQuantityValue <= palier.maxVoice &&
        this.voiceQuantityValue >= palier.minVoice
    );
    this.calculTotalAmount('voice');
  }

  onDataGaugeChanged() {
    this.selectedDataPalier = this.currentPaliers.find(
      (palier) =>
        this.dataVolumeValue <= palier.maxDataVolume &&
        this.dataVolumeValue >= palier.minDataVolume
    );
    this.calculTotalAmount('data');
  }

  calculTotalAmount(changedElement: 'data' | 'voice') {
    const amountData =
      this.dataVolumeValue * this.selectedDataPalier.dataPrice * 1.239;
    const amountVoice =
      this.voiceQuantityValue * this.selectedVoicePalier.voicePrice * 1.239;
    this.totalPrice = Math.round(amountData + amountVoice);
    if (
      this.totalPrice >= this.validityMinPrice &&
      this.totalPrice <= this.validityMaxPrice
    )
      return;
    if (this.totalPrice < this.validityMinPrice) {
      changedElement === 'data'
        ? this.getMinVoiceValueDependingOnChoosenDataValue()
        : this.getMinDataValueDependingOnChoosenVoiceValue();
    }
    if (this.totalPrice > this.validityMaxPrice) {
      changedElement === 'data'
        ? this.getMaxVoiceValueDependingOnChoosenDataValue()
        : this.getMaxDataValueDependingOnChoosenVoiceValue();
    }
  }

  getMaxDataValueDependingOnChoosenVoiceValue() {
    const currentVoicePrice =
      this.voiceQuantityValue * this.selectedVoicePalier.voicePrice * 1.239;
    const currentDataPrice =
      this.dataVolumeValue * this.selectedDataPalier.dataPrice * 1.239;
    if (currentVoicePrice + currentDataPrice <= this.validityMaxPrice) return;
    const maxDataPrice = this.validityMaxPrice - currentVoicePrice;
    if (maxDataPrice <= 0) return;
    this.selectedDataPalier = this.currentPaliers.find(
      (palier) =>
        maxDataPrice >= palier.minDataVolume * palier.dataPrice * 1.239
    );
    const maxDataValue =
      maxDataPrice / (this.selectedDataPalier.dataPrice * 1.239);
    this.dataVolumeValue =
      this.dataVolumeValue > maxDataValue ? maxDataValue : this.dataVolumeValue;
  }

  getMinDataValueDependingOnChoosenVoiceValue() {
    const currentVoicePrice =
      this.voiceQuantityValue * this.selectedVoicePalier.voicePrice * 1.239;
    const currentDataPrice =
      this.dataVolumeValue * this.selectedDataPalier.dataPrice * 1.239;
    if (currentVoicePrice + currentDataPrice >= this.validityMinPrice) return;
    const minDataPrice = this.validityMinPrice - currentVoicePrice;
    if (minDataPrice <= 0) return;
    this.selectedDataPalier = this.currentPaliers.find(
      (palier) =>
        minDataPrice >= palier.minDataVolume * palier.dataPrice * 1.239
    );
    const minDataValue =
      minDataPrice / (this.selectedDataPalier.dataPrice * 1.239);
    this.dataVolumeValue =
      this.dataVolumeValue < minDataValue ? minDataValue : this.dataVolumeValue;
  }

  getMaxVoiceValueDependingOnChoosenDataValue() {
    const currentDataPrice =
      this.dataVolumeValue * this.selectedDataPalier.dataPrice * 1.239;
    const currentVoicePrice =
      this.voiceQuantityValue * this.selectedVoicePalier.voicePrice * 1.239;
    if (currentVoicePrice + currentDataPrice <= this.validityMaxPrice) return;
    const maxVoicePrice = this.validityMaxPrice - currentDataPrice;
    if (maxVoicePrice <= 0) return;
    this.selectedVoicePalier = this.currentPaliers.find(
      (palier) => maxVoicePrice >= palier.minVoice * palier.voicePrice * 1.239
    );
    const maxVoiceValue =
      maxVoicePrice / (this.selectedDataPalier.voicePrice * 1.239);
    this.voiceQuantityValue =
      this.voiceQuantityValue > maxVoiceValue
        ? maxVoiceValue
        : this.voiceQuantityValue;
  }

  getMinVoiceValueDependingOnChoosenDataValue() {
    const currentDataPrice =
      this.dataVolumeValue * this.selectedDataPalier.dataPrice * 1.239;
    const currentVoicePrice =
      this.voiceQuantityValue * this.selectedVoicePalier.voicePrice * 1.239;
    if (currentVoicePrice + currentDataPrice >= this.validityMinPrice) return;
    const minVoicePrice = this.validityMinPrice - currentDataPrice;
    if (minVoicePrice <= 0) return;
    this.selectedVoicePalier = this.currentPaliers.find((palier) => {
      return minVoicePrice >= palier.minVoice * palier.voicePrice * 1.239;
    });
    const minVoiceValue =
      minVoicePrice / (this.selectedVoicePalier.voicePrice * 1.239);
    this.voiceQuantityValue =
      this.voiceQuantityValue < minVoiceValue
        ? minVoiceValue
        : this.voiceQuantityValue;
  }

  goRecapPage() {
    const pass = {
      data: this.dataVolumeValue,
      amount: this.totalPrice,
      voice: this.voiceQuantityValue,
      validity: this.illiflexValidity,
      recipient: this.dashboardService.getCurrentPhoneNumber(),
    };
    let navigationExtras: NavigationExtras = {
      state: {
        pass,
        recipientMsisdn: this.dashboardService.getCurrentPhoneNumber(),
        amount: this.totalPrice,
        purchaseType: OPERATION_TYPE_PASS_ILLIFLEX,
        title: this.illiflexTitle,
      },
    };
    this.router.navigate(['/operation-recap'], navigationExtras);
  }
}
