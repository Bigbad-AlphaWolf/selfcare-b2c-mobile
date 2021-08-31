import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  PassInternetModel,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_OM,
} from 'src/shared';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import {
  PROFILE_TYPE_POSTPAID,
  HOME_PREPAID_FORMULE,
  KILIMANJARO_FORMULE,
} from '../dashboard';
import { BuyPassModel } from '../services/dashboard-service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { ModalController } from '@ionic/angular';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { NewPinpadModalPage } from '../new-pinpad-modal/new-pinpad-modal.page';
import { OperationSuccessFailModalPage } from '../operation-success-fail-modal/operation-success-fail-modal.page';
import { OperationExtras } from '../models/operation-extras.model';
import { ModalSuccessModel } from '../models/modal-success-infos.model';
@Component({
  selector: 'app-buy-pass-internet',
  templateUrl: './buy-pass-internet.page.html',
  styleUrls: ['./buy-pass-internet.page.scss'],
})
export class BuyPassInternetPage implements OnInit {
  OPERATION_TYPE_PASS_INTERNET = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_TYPE_PASS_ILLIMIX = OPERATION_TYPE_PASS_ILLIMIX;
  step = 0;
  destinataire: string;
  currentUserNumber: any;
  choosedPaymentMod: string;
  passInternetChoosen: PassInternetModel;
  purchasePass: any;
  // dialogRef: MatDialogRef<UnauthorizedSosModalComponent, any>;
  PAYMENT_MOD_CREDIT = PAYMENT_MOD_CREDIT;
  PAYMENT_MOD_OM = PAYMENT_MOD_OM;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  CODE_FORMULE_KILIMANJARO = KILIMANJARO_FORMULE;
  passFavorisSelected: any;
  passsFavorisChoosen = false;
  pinErrorMsg = '';
  pinPadHasError = false;
  failed;
  errorMsg;
  recipient;
  title = 'Acheter pass internet';
  currentProfil: string;
  currentFormule: string;
  currentCodeFormule: string;
  recipientFirstName = '';
  recipientLastName = '';
  buyingPass: boolean;
  idPassSelected: number;
  buyForFixPrepaid: boolean;
  destCodeFormule: string;
  pageAccessUrl: string;
  opXtras: OperationExtras = {};

  constructor(
    private router: Router,
    private dashServ: DashboardService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private passService: PassInternetService,
    private followAnalyticsService: FollowAnalyticsService,
    private modalController: ModalController,
    private orangeMoneyService: OrangeMoneyService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.currentUserNumber = this.dashServ.getCurrentPhoneNumber();
    this.step = 0;
    this.checkUserIsPostPaid();
  }

  /** les etapes
   * step 0 choix du mode de paiement
   * step 1 choix du destinataire
   * step 2 choix du pass
   * step 3 confirmation ou validation
   * step 4 effectuer la transaction par OM
   * step 5 message
   */

  // TODO Trouver des valeurs plus parlantes pour les steps que 0 1 ...
  // TODO Pensez à l'internationalisation

  checkUserIsPostPaid() {
    this.authService
      .getSubscription(this.currentUserNumber)
      .subscribe((souscription: any) => {
        this.idPassSelected = +this.route.snapshot.paramMap.get('id');
        this.currentProfil = souscription.profil;
        this.currentFormule = souscription.nomOffre;
        this.currentCodeFormule = souscription.code;
        this.opXtras.code = this.currentCodeFormule;
        if (this.currentProfil === PROFILE_TYPE_POSTPAID) {
          this.step = 1;
          this.choosedPaymentMod = PAYMENT_MOD_OM;
        } else if (this.idPassSelected) {
          this.destinataire = this.currentUserNumber;
          this.buyForFixPrepaid = true;
          this.passService
            .getPassById(this.idPassSelected)
            .subscribe((pass: any) => {
              this.passInternetChoosen = pass;
              this.purchasePass = {
                destinataire: this.destinataire,
                pass,
                paymentMod: this.choosedPaymentMod,
              };
              this.step = 0;
            });
        } else {
          this.destCodeFormule = souscription.code;
          this.destinataire = this.currentUserNumber;
          // remove check on urls for deeplinks
          if (this.router.url.match('buy-pass-internet-by-om')) {
            this.choosedPaymentMod = 'ORANGE_MONEY';
            this.step = 2;
          } else if (this.router.url.match('buy-pass-internet-by-credit')) {
            this.choosedPaymentMod = 'CREDIT';
            this.step = 2;
          }
        }
      });
  }

  contactGot(contact) {
    this.recipientFirstName = contact.name.givenName;
    this.recipientLastName = contact.name.familyName
      ? contact.name.familyName
      : '';
    this.recipientFirstName += contact.name.middleName
      ? ` ${contact.name.middleName}`
      : '';
  }

  nextStepOfPaymentMod(paymentMod: string) {
    this.passsFavorisChoosen = false;
    this.choosedPaymentMod = paymentMod;
    if (this.buyForFixPrepaid) {
      this.step = 3;
    } else {
      this.goToNextStep();
    }
  }

  nextStepOfSelectDest(destNumberInfos: {
    destinataire: string;
    code: string;
  }) {
    this.destinataire = destNumberInfos.destinataire;
    this.destCodeFormule = destNumberInfos.code;
    if (destNumberInfos.destinataire !== this.currentUserNumber) {
      this.followAnalyticsService.registerEventFollow(
        'Pass_Internet_ChoixDestinataire',
        'event',
        destNumberInfos.destinataire
      );
    } else {
      this.followAnalyticsService.registerEventFollow(
        'Pass_Internet_ChoixDestinataire',
        'event',
        destNumberInfos.destinataire
      );
    }
    this.goToNextStep();
  }

  nextStepOfChoosePassInternet(passInternet: any) {
    this.passInternetChoosen = passInternet;
    this.purchasePass = {
      destinataire: this.destinataire,
      pass: passInternet,
      paymentMod: this.choosedPaymentMod,
    };
    this.goToNextStep();
  }

  payWithOM() {
    this.openPinpad();
  }

  buyPassByCredit() {
    this.buyingPass = true;
    const codeIN = this.purchasePass.pass.price_plan_index;
    const amount = +this.purchasePass.pass.tarif;
    const msisdn = this.currentUserNumber;
    const receiver = this.destinataire;
    const payload: BuyPassModel = {
      type: 'internet',
      codeIN,
      amount,
      msisdn,
      receiver,
    };
    this.dashServ.buyPassByCredit(payload).subscribe(
      (res: any) => {
        this.transactionSuccessful(res);
      },
      (err) => {
        this.transactionFailure(err);
      }
    );
  }

  passInternetPurchase() {
    if (this.choosedPaymentMod === PAYMENT_MOD_CREDIT) {
      // Make request for buying pass with credit
      this.buyPassByCredit();
    } else {
      this.payWithOM();
    }
  }

  passFavorisPurchased(passFavorisChoosedBy: any) {
    this.purchasePass = passFavorisChoosedBy;
    this.choosedPaymentMod = passFavorisChoosedBy.paymentMod;
    this.passInternetPurchase();
  }

  goToNextStep() {
    this.step++;
  }

  goToFinalStep() {
    this.step = 4;
  }

  goToPreviousStep() {
    const previousStep = this.step - 1;
    if (
      previousStep < 0 ||
      (this.currentProfil === PROFILE_TYPE_POSTPAID && previousStep === 0) ||
      (this.currentFormule === HOME_PREPAID_FORMULE && previousStep === 1)
    ) {
      this.goToDashboardPage();
    } else if (
      this.passsFavorisChoosen ||
      (this.buyForFixPrepaid && this.step === 3)
    ) {
      this.step = 0;
    } else {
      this.step = previousStep;
    }
  }

  initialStep() {
    this.step = 0;
  }
  goToStepValidation() {
    this.step = 3;
  }

  nextStepOfFavorisPass(passFavoris: any) {
    this.passsFavorisChoosen = true;
    this.passFavorisSelected = passFavoris;
    this.purchasePass = {
      pass: passFavoris,
      destinataire: this.currentUserNumber,
    };
    this.goToStepValidation();
  }

  async openPinpad() {
    const modal = await this.modalController.create({
      component: NewPinpadModalPage,
      cssClass: 'pin-pad-modal',
      componentProps: {
        operationType: OPERATION_TYPE_PASS_INTERNET,
        buyPassPayload: this.purchasePass,
        opXtras: this.opXtras,
      },
    });
    modal.onDidDismiss().then((response) => {
      if (response.data && response.data.success) {
        this.openSuccessFailModal({
          opXtras: response.data.opXtras,
          success: true,
          msisdnBuyer: this.orangeMoneyService.getOrangeMoneyNumber(),
          buyForMe:
            this.destinataire ===
            this.orangeMoneyService.getOrangeMoneyNumber(),
        });
      }
    });
    return await modal.present();
  }

  async openSuccessFailModal(params: ModalSuccessModel) {
    params.passBought = this.purchasePass.pass;
    params.paymentMod = this.choosedPaymentMod;
    params.recipientMsisdn = this.destinataire;
    params.recipientName =
      this.recipientFirstName && this.recipientLastName
        ? this.recipientFirstName + ' ' + this.recipientLastName
        : null;
    params.purchaseType = OPERATION_TYPE_PASS_INTERNET;
    const modal = await this.modalController.create({
      component: OperationSuccessFailModalPage,
      cssClass: params.success ? 'success-modal' : 'failed-modal',
      componentProps: params,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {});
    return await modal.present();
  }

  goToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  transactionSuccessful(res: any) {
    this.buyingPass = false;
    if (res.code !== '0') {
      this.failed = true;
      this.errorMsg = res.message;
      const followDetails = { error_code: res.code };
      this.followAnalyticsService.registerEventFollow(
        'Credit_Buy_Pass_Internet_Error',
        'error',
        followDetails
      );
    } else {
      this.failed = false;
      const followDetails = {
        option_name: this.purchasePass.pass.nom,
        amount: this.purchasePass.pass.tarif,
        plan: this.purchasePass.pass.price_plan_index,
      };
      this.followAnalyticsService.registerEventFollow(
        'Credit_Buy_Pass_Internet_Success',
        'event',
        followDetails
      );
    }
    this.goToFinalStep();
  }

  transactionFailure(err) {
    this.buyingPass = false;
    this.failed = true;
    this.goToFinalStep();
    if (err && err.error && err.error.message) {
      this.errorMsg = err.error.message;
    } else {
      this.errorMsg = 'Service indisponible. Veuillez réessayer ultérieurement';
    }
    this.followAnalyticsService.registerEventFollow(
      'Credit_Buy_Pass_Internet_Error',
      'error',
      {
        msisdn1: this.currentUserNumber,
        msisdn2: this.destinataire,
        message: this.errorMsg,
      }
    );
  }
}
