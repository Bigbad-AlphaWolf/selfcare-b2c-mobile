import { Component, OnInit } from '@angular/core';
import { OPERATION_TYPE_RECHARGE_CREDIT, PAYMENT_MOD_OM } from 'src/shared';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { formatCurrency, PROFILE_TYPE_POSTPAID } from '../dashboard';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-buy-credit',
  templateUrl: './buy-credit.page.html',
  styleUrls: ['./buy-credit.page.scss']
})
export class BuyCreditPage implements OnInit {
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  operation;
  typeOMCode;
  step = 0;
  isForMyOwnNumber = true;
  destinatorPhoneNumber = '';
  choosedPaymentMod = PAYMENT_MOD_OM;
  amount;
  creditToBuy;
  pinErrorMsg = '';
  pinPadHasError = false;
  PROFILE_TYPE_POSTPAID = PROFILE_TYPE_POSTPAID;
  balancePinErrorMsg;
  balancePinPadHasError;
  omBalancePinPadDisplayed = false;
  currentOMBalance = 0;
  purchasePass: any;
  errorCounting = 0;
  failed: boolean;
  hideUserSolde = true;
  omBalance;
  recipient;
  title = 'Recharger du crédit';
  currentProfil;
  currentNumber;
  recipientFirstName: string = '';
  recipientLastName: string = '';

  constructor(
    private router: Router,
    private dashbordServ: DashboardService,
    private authService: AuthenticationService,
    private followAnalyticsService: FollowAnalyticsService
  ) {}

  ngOnInit() {
    this.currentNumber = this.dashbordServ.getCurrentPhoneNumber();
    this.authService
      .getSubscription(this.currentNumber)
      .subscribe((souscription: any) => {
        this.currentProfil = souscription.profil;
      });
  }

  showOMBalancePinPad() {
    if (this.step === 1) {
      this.operation = 'CHECK_SOLDE';
    }
    this.omBalancePinPadDisplayed = true;
  }

  soldeGot(solde) {
    if (solde !== 'erreur') {
      this.omBalancePinPadDisplayed = false;
      this.omBalance = solde;
      this.hideUserSolde = false;
      if (this.step === 2) {
        this.step = 3;
      }
    } else {
      if (this.step === 2) {
        if (this.errorCounting < 3) {
          this.errorCounting += 1;
        } else if (this.errorCounting === 3) {
          this.failed = true;
          this.step = 3;
        }
      }
    }
  }

  formatCurrency(data) {
    return formatCurrency(data);
  }

  nextStepOfSelectDest(destNumber: string) {
    this.goToNextStep();
    this.isForMyOwnNumber =
      this.dashbordServ.getCurrentPhoneNumber() === destNumber;
    this.destinatorPhoneNumber = destNumber;
    this.isForMyOwnNumber
      ? this.followAnalyticsService.registerEventFollow(
          'Recharge_OM_ChoixDestinataire',
          'event',
          destNumber
        )
      : this.followAnalyticsService.registerEventFollow(
          'Recharge_OM_Destinataire_Moi',
          'event',
          destNumber
        );
  }

  setAmount(amount: number) {
    this.amount = amount;
    this.goToNextStep();
    this.destinatorPhoneNumber = this.currentNumber;
  }

  payCredit() {
    this.operation = 'BUY_CREDIT';
    this.omBalancePinPadDisplayed = true;
    this.creditToBuy = {
      msisdn2: this.destinatorPhoneNumber,
      amount: this.amount
    };
  }

  goToNextStep() {
    this.step++;
  }

  goToPreviousStep() {
    this.operation = 'CHECK_SOLDE';
    this.omBalancePinPadDisplayed = false;
    const previousStep = this.step - 1;
    if (previousStep < 0) {
      this.goToDashboardPage();
    } else {
      this.step = previousStep;
    }
  }

  initialStep() {
    this.choosedPaymentMod = PAYMENT_MOD_OM;
    this.amount = 0;
    this.isForMyOwnNumber = false;
    this.creditToBuy = null;
    this.pinErrorMsg = '';
    this.pinPadHasError = false;
    this.balancePinErrorMsg = '';
    this.balancePinPadHasError = false;
    this.omBalancePinPadDisplayed = false;
    this.currentOMBalance = 0;
    this.hideUserSolde = true;
  }

  goToDashboardPage() {
    this.router.navigate(['/dashboard']);
  }

  contactGot(contact) {
    this.recipientFirstName = contact.name.givenName ? contact.name.givenName : '' ;
    this.recipientLastName = contact.name.familyName
      ? contact.name.familyName
      : '';
    this.recipientFirstName += contact.name.middleName
      ? ` ${contact.name.middleName}`
      : '';
  }
}
