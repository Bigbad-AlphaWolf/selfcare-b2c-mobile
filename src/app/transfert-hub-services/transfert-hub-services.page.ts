import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-transfert-hub-services',
  templateUrl: './transfert-hub-services.page.html',
  styleUrls: ['./transfert-hub-services.page.scss'],
})
export class TransfertHubServicesPage implements OnInit {
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
      title: 'Transfert',
      subtitle: "d'argent",
      icon: '/assets/images/ic-top-up-mobile@2x.png',
      action: 'REDIRECT',
      type: 'CREDIT',
      url: '',
    },
    {
      title: 'Transfert',
      subtitle: 'de crédit',
      icon: '/assets/images/ic-internet-usage@2x.png',
      action: 'REDIRECT',
      type: 'PASS',
      url: '',
    },
    {
      title: 'Transfert',
      subtitle: 'de bonus',
      icon: '/assets/images/ic-package-services@2x.png',
      action: 'REDIRECT',
      type: 'PASS_ILLIMIX',
      url: '',
    },
    ,
    {
      title: 'Transfert',
      subtitle: 'de bonus',
      icon: '/assets/images/ic-reward.png',
      action: 'REDIRECT',
      type: 'PASS_VOYAGE',
      url: '',
    },
    ,
    {
      title: 'Transfert',
      subtitle: 'de bonus',
      icon: '/assets/images/ic-reward.png',
      action: 'REDIRECT',
      type: 'PASS_INTERNATIONAL',
      url: '',
    },
  ];
  options = [];
  constructor(
    private appRouting: ApplicationRoutingService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (
        this.router.getCurrentNavigation() &&
        this.router.getCurrentNavigation().extras.state &&
        this.router.getCurrentNavigation().extras.state.purchaseType
      ) {
        const purchaseType = this.router.getCurrentNavigation().extras.state
          .purchaseType;
        purchaseType === 'TRANSFER'
          ? (this.options = this.transferOptions)
          : (this.options = this.buyOptions);
      } else {
        this.appRouting.goToDashboard();
      }
    });
  }

  goToDashboard() {
    this.appRouting.goToDashboard();
  }

  goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_MONEY' | 'TRANSFERT_CREDIT' | 'TRANSFERT_BONUS';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
  }) {
    switch (opt.type) {
      case 'TRANSFERT_MONEY':
        if (opt.action === 'REDIRECT') {
          this.appRouting.goToTransfertMoneyPage();
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
      default:
        break;
    }
  }
}
