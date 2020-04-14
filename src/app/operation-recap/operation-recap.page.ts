import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SetPaymentChannelModalPage } from '../set-payment-channel-modal/set-payment-channel-modal.page';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { BuyPassModel } from '../services/dashboard-service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OPERATION_TYPE_PASS_INTERNET } from 'src/shared';

@Component({
  selector: 'app-operation-recap',
  templateUrl: './operation-recap.page.html',
  styleUrls: ['./operation-recap.page.scss'],
})
export class OperationRecapPage implements OnInit {
  passChoosen: any = {
    type: 'pass_internet',
    id: 29,
    nom: '7 Go',
    volumeInternet: '7 Go',
    tarif: '5000',
    bonus: null,
    description: null,
    actif: true,
    validitePass: 'MOIS',
    promos: null,
    duree: null,
    bonusNuit: '1 Go offert et utilisable entre 00h et 08h',
    compteurCredite: null,
    price_plan_index: 8488,
    price_plan_index_om: 55009,
  };
  recipientMsisdn: string = '775896287';
  recipientName: string;
  recipientCodeFormule;
  buyingPass: boolean;
  currentUserNumber: string;
  buyPassFailed: boolean;
  buyPassErrorMsg: string;
  buyPassPayload: any;

  constructor(
    public modalController: ModalController,
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashboardService.getCurrentPhoneNumber();
    this.route.queryParams.subscribe((params) => {
      console.log(this.router.getCurrentNavigation());
      if (
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.pass
      ) {
        this.passChoosen = this.router.getCurrentNavigation().extras.state.pass;
        this.recipientMsisdn = this.router.getCurrentNavigation().extras.state.recipientMsisdn;
        this.recipientCodeFormule = this.router.getCurrentNavigation().extras.state.recipientCodeFormule;
        this.recipientName = this.router.getCurrentNavigation().extras.state.recipientName;
      }
    });
    this.buyPassPayload = {
      destinataire: this.recipientMsisdn,
      pass: this.passChoosen,
    };
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: SetPaymentChannelModalPage,
      cssClass: 'set-channel-payment-modal',
    });
    modal.onDidDismiss().then((response) => {
      if (response.data.paymentMod === 'CREDIT') {
        this.payWithCredit();
      }
      if (response.data.paymentMod === 'ORANGE_MONEY') {
        this.payWithOm();
      }
    });
    return await modal.present();
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: OPERATION_TYPE_PASS_INTERNET,
        buyPassPayload: this.buyPassPayload,
      },
    });
    modal.onDidDismiss().then((response) => {});
    return await modal.present();
  }

  goBackToListPass() {
    let navigationExtras: NavigationExtras = {
      state: {
        payload: {
          destinataire: this.recipientMsisdn,
          code: this.recipientCodeFormule,
        },
      },
    };
    this.router.navigate(['/list-pass-internet-v3'], navigationExtras);
  }

  payWithCredit() {
    this.buyingPass = true;
    const codeIN = this.passChoosen.price_plan_index;
    const amount = +this.passChoosen.tarif;
    const msisdn = this.currentUserNumber;
    const receiver = this.recipientMsisdn;
    const payload: BuyPassModel = {
      type: 'internet',
      codeIN,
      amount,
      msisdn,
      receiver,
    };
    this.dashboardService.buyPassByCredit(payload).subscribe(
      (res: any) => {
        this.transactionSuccessful(res);
      },
      (err) => {
        this.transactionFailure();
      }
    );
  }

  payWithOm() {
    this.openPinpad();
  }

  transactionSuccessful(res: any) {
    this.buyingPass = false;
    if (res.code !== '0') {
      this.buyPassFailed = true;
      this.buyPassErrorMsg = res.message;
      const followDetails = { error_code: res.code };
      this.followAnalyticsService.registerEventFollow(
        'Credit_Buy_Pass_Internet_Error',
        'error',
        followDetails
      );
    } else {
      this.buyPassFailed = false;
      const followDetails = {
        option_name: this.passChoosen.nom,
        amount: this.passChoosen.tarif,
        plan: this.passChoosen.price_plan_index,
      };
      this.followAnalyticsService.registerEventFollow(
        'Credit_Buy_Pass_Internet_Success',
        'event',
        followDetails
      );
    }
    this.openSuccessModal();
  }

  transactionFailure() {
    this.buyingPass = false;
    this.buyPassFailed = true;
    this.openSuccessModal();
    this.buyPassErrorMsg =
      'Service indisponible. Veuillez réessayer ultérieurement';
    this.followAnalyticsService.registerEventFollow(
      'Credit_Buy_Pass_Internet_Error',
      'error',
      {
        msisdn1: this.currentUserNumber,
        msisdn2: this.recipientMsisdn,
        message: 'Service indisponible',
      }
    );
  }

  openSuccessModal() {}
}
