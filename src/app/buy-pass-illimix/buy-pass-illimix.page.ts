import { Component, OnInit } from '@angular/core';
import {
  OPERATION_TYPE_PASS_ILLIMIX,
  PassIllimModel,
  PromoPassIllimModel,
  PAYMENT_MOD_CREDIT,
  CODE_KIRENE_Formule,
  PAYMENT_MOD_OM
} from 'src/shared';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { BuyPassModel } from '../services/dashboard-service';
import { PROFILE_TYPE_POSTPAID } from '../dashboard';

@Component({
  selector: 'app-buy-pass-illimix',
  templateUrl: './buy-pass-illimix.page.html',
  styleUrls: ['./buy-pass-illimix.page.scss']
})
export class BuyPassIllimixPage implements OnInit {
  OPERATION_TYPE_PASS_ILLIMIX = OPERATION_TYPE_PASS_ILLIMIX;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  step = 0;
  passIllimixChoosed: any;
  // For now we consider that the recepient is the connected user
  destNumber: string; 
  passIllimixDetails: any;
  pinErrorMsg = '';
  pinPadHasError = false;
  errorMsg: string;
  failed: boolean;
  title = 'Achat de pass illimix';
  choosedPaymentMod: string;
  passIllimixChosen: PassIllimModel | PromoPassIllimModel;
  buyingPass: boolean;
  isKirene: boolean;
  currentUserNumber = this.dashServ.getCurrentPhoneNumber();;
  currentProfil: string;
  recipientFirstName: string;
recipientLastName: string;

  constructor(
    private router: Router,
    private dashServ: DashboardService,
    public dialog: MatDialog,
    private authServ: AuthenticationService
  ) {}

  /** les etapes
   * step 0 choix du mode de paiement
   * step 1 choix du pass
   * step 2 confirmation ou validation puis achat par credit
   * step 3 effectuer la transaction par OM
   * step 4 message
   */

  ngOnInit() {
    this.getCurrentSubscription();
    this.checkUserIsPostPaid();
  }

  checkUserIsPostPaid() {
    this.authServ
      .getSubscription(this.currentUserNumber)
      .subscribe((souscription: any) => {
        this.currentProfil = souscription.profil;
        if (this.currentProfil === PROFILE_TYPE_POSTPAID) {
          this.step = 1;
          this.choosedPaymentMod = PAYMENT_MOD_OM;
        }
      });
  }
  nextStepOfSelectDest(destNumber: string) {
    this.goToNextStep();
    this.destNumber = destNumber;
    console.log('destinataire', destNumber);
    
    /* if (typeof FollowAnalytics !== 'undefined') {
      if (destNumber !== this.currentUserNumber) {
        FollowAnalytics.logEvent('Pass_Internet_ChoixDestinataire', destNumber);
      } else {
        FollowAnalytics.logEvent('Pass_Internet_Destinataire_Moi', destNumber);
      }
    } */
  }


  contactGot(contact) {
    this.recipientFirstName = contact ? contact.name.givenName : '';
    this.recipientLastName = contact.name.familyName
      ? contact.name.familyName
      : '';
    this.recipientFirstName += contact.name.middleName
      ? ` ${contact.name.middleName}`
      : '';
  }

  nextStepOfPaymentMod(paymentMod: string) {
    this.choosedPaymentMod = paymentMod;
    this.goToNextStep();
  }

  goToNextStep() {
    this.step++;
  }

  passDataToStepValidation(passIllimix: any) {
    this.passIllimixChoosed = {
      destinataire: this.destNumber,
      pass: passIllimix,
      paymentMod: this.choosedPaymentMod
    };
    this.passIllimixChosen = passIllimix;
    this.goToNextStep();
  }

  goToPreviousStep() {
    const previousStep = this.step - 1;
    if (previousStep < 0) {
      this.goToDashboardPage();
    } else {
      this.step = previousStep;
    }
  }

  goToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  payWithOM(status) {
    if (status !== 'erreur') {
      this.goToNextStep();
    }
  }

  payWithCredit() {
    this.buyingPass = true;
    const codeIN = this.passIllimixChoosed.pass.price_plan_index;
    const amount = +this.passIllimixChoosed.pass.tarif;
    const msisdn = this.dashServ.getCurrentPhoneNumber();
    const receiver = this.destNumber;
    const payload: BuyPassModel = { type: 'illimix', codeIN, amount, msisdn, receiver };
    this.dashServ.buyPassByCredit(payload).subscribe(
      (res: any) => {
        this.buyingPass = false;
        if (res.code !== '0') {
          this.failed = true;
          this.errorMsg = res.message;
          const followDetails = { error_code: res.code };
        } else {
          const followDetails = {
            option_name: this.passIllimixChoosed.pass.nom,
            amount: this.passIllimixChoosed.pass.tarif,
            plan: this.passIllimixChoosed.pass.price_plan_index
          };
        }
        this.goToSuccessStep();
      },
      (err: any) => {
        this.buyingPass = false;
        this.failed = true;
        if (err.message) {
          if (err.error.status === 500) {
            this.errorMsg = 'Erreur réseau. Veuillez réessayer ultérieurement';
          } else {
            this.errorMsg =
              'Service indisponible. Veuillez réessayer ultérieurement';
          }
        }
        this.goToSuccessStep();
      }
    );
  }

  goToSuccessStep() {
    this.step = 4;
  }

  passDataToSuccessPage(passBought: any) {
    this.passIllimixDetails = passBought;
    if (this.passIllimixDetails.paymentMod === PAYMENT_MOD_CREDIT) {
      this.payWithCredit();
    } else {
      this.goToNextStep();
    }
  }

  returnToTheBeginning() {
    this.step = 0;
  }

  getCurrentSubscription() {
    const currentNumber = this.dashServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(currentNumber).subscribe((res: any) => {
      if (res.code === CODE_KIRENE_Formule) {
        this.title = 'Acheter un  Mixel';
        this.isKirene = true;
      }
    });
  }
}
