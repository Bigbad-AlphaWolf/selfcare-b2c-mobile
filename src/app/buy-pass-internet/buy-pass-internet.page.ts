import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  PassInternetModel,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_OM
} from 'src/shared';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';
declare var FollowAnalytics: any;
@Component({
  selector: 'app-buy-pass-internet',
  templateUrl: './buy-pass-internet.page.html',
  styleUrls: ['./buy-pass-internet.page.scss']
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
  passFavorisSelected: any;
  passsFavorisChoosen = false;
  pinErrorMsg = '';
  pinPadHasError = false;
  failed;
  errorMsg;
  recipient;
  title = 'Acheter pass internet';
  currentProfil;
  recipientFirstName = '';
  recipientLastName = '';

  constructor(
    private router: Router,
    private dashServ: DashboardService,
    private authService: AuthenticationService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashServ.getCurrentPhoneNumber();
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
    this.authService.getSubscription(this.currentUserNumber).subscribe((souscription: any) => {
      this.currentProfil = souscription.profil;
      if (this.currentProfil === PROFILE_TYPE_POSTPAID) {
        this.step = 1;
        this.choosedPaymentMod = PAYMENT_MOD_OM;
      }
    });
  }

  contactGot(contact) {
    this.recipientFirstName = contact.name.givenName;
    this.recipientLastName = contact.name.familyName ? contact.name.familyName : '';
    this.recipientFirstName += contact.name.middleName ? ` ${contact.name.middleName}` : '';
  }

  nextStepOfPaymentMod(paymentMod: string) {
    this.passsFavorisChoosen = false;
    this.choosedPaymentMod = paymentMod;
    this.goToNextStep();
    this.destinataire = this.currentUserNumber;
  }

  nextStepOfSelectDest(destNumber: string) {
    this.goToNextStep();
    this.destinataire = destNumber;
    if (typeof FollowAnalytics !== 'undefined') {
      if (destNumber !== this.currentUserNumber) {
        FollowAnalytics.logEvent('Pass_Internet_ChoixDestinataire', destNumber);
      } else {
        FollowAnalytics.logEvent('Pass_Internet_Destinataire_Moi', destNumber);
      }
    }
  }

  nextStepOfChoosePassInternet(passInternet: any) {
    this.passInternetChoosen = passInternet;
    this.purchasePass = {
      destinataire: this.destinataire,
      pass: passInternet,
      paymentMod: this.choosedPaymentMod
    };
    this.goToNextStep();
  }

  payWithOM() {
    this.goToNextStep();
  }

  payWithCredit() {
    if (this.destinataire !== this.currentUserNumber) {
      this.buyPassByCreditForSomeone();
    } else {
      this.buyPassByCreditForMyself();
    }
  }

  buyPassByCreditForMyself() {
    const codeIN = this.purchasePass.pass.price_plan_index;
    const amount = +this.purchasePass.pass.tarif;
    const type = 'internet';
    const payload = { type, codeIN, amount };
    this.dashServ.buyPassByCredit(payload).subscribe(
      (res: any) => {
        this.transactionSuccessful(res);
      },
      err => {
        this.transactionFailure();
      }
    );
  }
  buyPassByCreditForSomeone() {
    const pricePlanIndex = this.purchasePass.pass.price_plan_index;
    const paymentDN = this.currentUserNumber;
    const receiveDN = this.destinataire;
    const param = { paymentDN, receiveDN, pricePlanIndex };
    this.dashServ.buyPassByCreditForSomeone(param).subscribe(
      (res: any) => {
        this.transactionSuccessful(res);
      },
      err => {
        this.transactionFailure();
      }
    );
  }

  passInternetPurchase() {
    if (this.choosedPaymentMod === PAYMENT_MOD_CREDIT) {
      // Make request for buying pass with credit
      this.payWithCredit();
    } else {
      this.goToNextStep();
    }
  }

  passFavorisPurchased(passFavorisChoosedBy: any) {
    this.purchasePass = passFavorisChoosedBy;
    this.choosedPaymentMod = passFavorisChoosedBy.paymentMod;
    this.passInternetPurchase();
  }

  goToNextStep() {
    this.step++;
    // Avoid recipint choice step
    if (this.step === 1) {
      this.step++;
    }
  }

  goToFinalStep() {
    this.step = 5;
  }

  goToPreviousStep() {
    const previousStep = this.step - 1;
    if (previousStep < 0 || (this.currentProfil === PROFILE_TYPE_POSTPAID && previousStep === 0)) {
      this.goToDashboardPage();
    } else if (this.step === 2) {
      // Avoid recipint choice step
      this.step = 0;
    } else if ((this.choosedPaymentMod === PAYMENT_MOD_CREDIT && this.step === 2) || this.passsFavorisChoosen) {
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
      destinataire: this.currentUserNumber
    };
    this.goToStepValidation();
  }

  openSOSErrorDialog(errorMsg: string) {
    // this.dialogRef = this.dialog.open(UnauthorizedSosModalComponent, {
    //     minWidth: '355px',
    //     data: { message: errorMsg, type: 'pass' }
    // });
    alert(errorMsg);
  }

  omResultGot(result) {
    if (result !== 'erreur') {
      this.goToFinalStep();
    }
  }

  goToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  transactionSuccessful(res: any) {
    if (res.code !== '0') {
      this.failed = true;
      this.errorMsg = res.message;
      const followDetails = { error_code: res.code };
      if (typeof FollowAnalytics !== 'undefined') {
        FollowAnalytics.logError('Credit_Buy_Pass_Internet_Error', followDetails);
      }
    } else {
      const followDetails = {
        option_name: this.purchasePass.pass.nom,
        amount: this.purchasePass.pass.tarif,
        plan: this.purchasePass.pass.price_plan_index
      };
      if (typeof FollowAnalytics !== 'undefined') {
        FollowAnalytics.logEvent('Credit_Buy_Pass_Internet_Success', followDetails);
      }
    }
    this.goToFinalStep();
  }

  transactionFailure() {
    this.failed = true;
    this.goToFinalStep();
    this.errorMsg = 'Service indisponible. Veuillez réessayer ultérieurement';
  }
}
