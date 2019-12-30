import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  PassInternetModel,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_OM
} from 'src/shared';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { PROFILE_TYPE_POSTPAID, HOME_PREPAID_FORMULE } from '../dashboard';
import { BuyPassModel } from '../services/dashboard-service';
import { PassInternetService } from '../services/pass-internet-service/pass-internet.service';
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
  currentProfil: string;
  currentFormule: string;
  recipientFirstName = '';
  recipientLastName = '';
  buyingPass: boolean;
  idPassSelected: number;
  buyForFixPrepaid: boolean;
  destCodeFormule: string;

  constructor(
    private router: Router,
    private dashServ: DashboardService,
    private authService: AuthenticationService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private passService: PassInternetService
  ) {}

  ngOnInit() {
    this.currentUserNumber = this.dashServ.getCurrentPhoneNumber();
    this.checkUserIsPostPaid();
  }

  ionViewDidEnter() {
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
    this.authService
      .getSubscription(this.currentUserNumber)
      .subscribe((souscription: any) => {
        this.currentProfil = souscription.profil;
        this.currentFormule = souscription.nomOffre;
        if (this.currentProfil === PROFILE_TYPE_POSTPAID) {
          this.step = 1;
          this.choosedPaymentMod = PAYMENT_MOD_OM;
        } else if (this.currentFormule === HOME_PREPAID_FORMULE) {
          this.destinataire = this.currentUserNumber;
          // this.choosedPaymentMod = PAYMENT_MOD_CREDIT;
          this.idPassSelected = +this.route.snapshot.paramMap.get('id');
          if (this.idPassSelected) {
            this.buyForFixPrepaid = true;
            this.passService
              .getPassById(this.idPassSelected)
              .subscribe((pass: any) => {
                this.passInternetChoosen = pass;
                this.purchasePass = {
                  destinataire: this.destinataire,
                  pass,
                  paymentMod: this.choosedPaymentMod
                };
                this.step = 0;
              });
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
    this.goToNextStep();
    if (typeof FollowAnalytics !== 'undefined') {
      if (destNumberInfos !== this.currentUserNumber) {
        FollowAnalytics.logEvent(
          'Pass_Internet_ChoixDestinataire',
          destNumberInfos.destinataire
        );
      } else {
        FollowAnalytics.logEvent(
          'Pass_Internet_Destinataire_Moi',
          destNumberInfos.destinataire
        );
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
      receiver
    };
    this.dashServ.buyPassByCredit(payload).subscribe(
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
      this.buyPassByCredit();
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
  }

  goToFinalStep() {
    this.step = 5;
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
      destinataire: this.currentUserNumber
    };
    this.goToStepValidation();
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
    this.buyingPass = false;
    if (res.code !== '0') {
      this.failed = true;
      this.errorMsg = res.message;
      const followDetails = { error_code: res.code };
      if (typeof FollowAnalytics !== 'undefined') {
        FollowAnalytics.logError(
          'Credit_Buy_Pass_Internet_Error',
          followDetails
        );
      }
    } else {
      const followDetails = {
        option_name: this.purchasePass.pass.nom,
        amount: this.purchasePass.pass.tarif,
        plan: this.purchasePass.pass.price_plan_index
      };
      if (typeof FollowAnalytics !== 'undefined') {
        FollowAnalytics.logEvent(
          'Credit_Buy_Pass_Internet_Success',
          followDetails
        );
      }
    }
    this.goToFinalStep();
  }

  transactionFailure() {
    this.buyingPass = false;
    this.failed = true;
    this.goToFinalStep();
    this.errorMsg = 'Service indisponible. Veuillez réessayer ultérieurement';
  }
}
