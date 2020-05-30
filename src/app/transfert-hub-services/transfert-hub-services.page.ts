import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { ModalController } from '@ionic/angular';
import { SelectBeneficiaryPopUpComponent } from './components/select-beneficiary-pop-up/select-beneficiary-pop-up.component';
import { OrangeMoneyService } from '../services/orange-money-service/orange-money.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FollowAnalyticsService } from '../services/follow-analytics/follow-analytics.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';

@Component({
  selector: 'app-transfert-hub-services',
  templateUrl: './transfert-hub-services.page.html',
  styleUrls: ['./transfert-hub-services.page.scss'],
})
export class TransfertHubServicesPage implements OnInit {
  pageTitle: string;
  transferOptions: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_MONEY' | 'TRANSFERT_CREDIT' | 'TRANSFERT_BONUS';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [
    {
      title: 'Transfert',
      subtitle: "d'argent",
      icon: '/assets/images/icOrangeMoney.png',
      action: 'REDIRECT',
      type: 'TRANSFERT_MONEY',
      url: '',
    },
    {
      title: 'Transfert',
      subtitle: 'de crédit',
      icon: '/assets/images/ic-top-up-mobile@2x.png',
      action: 'REDIRECT',
      type: 'TRANSFERT_CREDIT',
      url: '',
    },
    {
      title: 'Transfert',
      subtitle: 'de bonus',
      icon: '/assets/images/ic-reward.png',
      action: 'REDIRECT',
      type: 'TRANSFERT_BONUS',
      url: '',
    },
  ];
  buyOptions: {
    title: string;
    subtitle: string;
    icon: string;
    type:
      | 'CREDIT'
      | 'PASS'
      | 'PASS_ILLIMIX'
      | 'PASS_VOYAGE'
      | 'PASS_INTERNATIONAL';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }[] = [
    {
      title: 'Crédit',
      subtitle: 'recharge',
      icon: '/assets/images/ic-top-up-mobile@2x.png',
      action: 'REDIRECT',
      type: 'CREDIT',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'internet',
      icon: '/assets/images/ic-internet-usage@2x.png',
      action: 'REDIRECT',
      type: 'PASS',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'illimix',
      icon: '/assets/images/ic-package-services@2x.png',
      action: 'REDIRECT',
      type: 'PASS_ILLIMIX',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'voyage',
      icon: '/assets/images/ic-aeroplane.png',
      action: 'REDIRECT',
      type: 'PASS_VOYAGE',
      url: '',
    },
    {
      title: 'Pass',
      subtitle: 'international',
      icon: '/assets/images/ic-international.png',
      action: 'REDIRECT',
      type: 'PASS_INTERNATIONAL',
      url: '',
    },
  ];
  options = [];
  omPhoneNumber: string;
  isProcessing: boolean;
  errorMsg: string;
  dataPayload: any;
  constructor(
    private appRouting: ApplicationRoutingService,
    private modalController: ModalController  ) {}

  ngOnInit() {
    let purchaseType;
    if(history && history.state){
      purchaseType = history.state.purchaseType;
    }
    if (purchaseType === 'TRANSFER') {
      this.options = this.transferOptions;
      this.pageTitle = 'Transférer argent ou crédit';
    } else {
      this.options = this.buyOptions;
      this.pageTitle = 'Acheter crédit ou pass';
    }
  }

  goToDashboard() {
    this.appRouting.goToDashboard();
  }

  goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: string;
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    switch (opt.type) {
      case 'TRANSFERT_MONEY':
        if (opt.action === 'REDIRECT') {
          this.showBeneficiaryModal();
        }
        break;
      case 'TRANSFERT_CREDIT':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToTransfertCreditPage();
        }
        break;
      case 'TRANSFERT_BONUS':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToTransfertBonusPage();
        }
        break;
      case 'CREDIT':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goBuyCredit();
        }
        break;
      case 'PASS':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToSelectRecepientPassInternet();
        }
        break;
      case 'PASS_ILLIMIX':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToSelectRecepientPassIllimix();
        }
        break;
      default:
        break;
    }
  }

  async showBeneficiaryModal() {
    const modal = await this.modalController.create({
      component: SelectBeneficiaryPopUpComponent,
      cssClass: 'customModalCssTrasnfertOMWithoutCode',
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data && response.data.recipientMsisdn) {
        const pageData = response.data;
        this.appRouting.goSetAmountPage(pageData);
        // this.getOmPhoneNumberAndCheckrecipientHasOMAccount(this.dataPayload);
      }
    });
    return await modal.present();
  }
}
