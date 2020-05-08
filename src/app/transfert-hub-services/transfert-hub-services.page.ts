import { Component, OnInit } from '@angular/core';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';

@Component({
  selector: 'app-transfert-hub-services',
  templateUrl: './transfert-hub-services.page.html',
  styleUrls: ['./transfert-hub-services.page.scss'],
})
export class TransfertHubServicesPage implements OnInit {
  options: {
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
    icon: "/assets/images/icOrangeMoney.png",
    action: "REDIRECT",
    type: "TRANSFERT_MONEY",
    url:""
  },
  {
    title: 'Transfert',
    subtitle: "de crédit",
    icon: "/assets/images/ic-top-up-mobile@2x.png",
    action: "REDIRECT",
    type: "TRANSFERT_CREDIT",
    url:""
  },
  {
    title: 'Transfert',
    subtitle: "de bonus",
    icon: "/assets/images/",
    action: "REDIRECT",
    type: "TRANSFERT_BONUS",
    url:""
  }
];
  constructor(private appRouting: ApplicationRoutingService) { }

  ngOnInit() {
  }

  goToDashboard(){
    this.appRouting.goToDashboard();
  }

  goTo(opt: {
    title: string;
    subtitle: string;
    icon: string;
    type: 'TRANSFERT_MONEY' | 'TRANSFERT_CREDIT' | 'TRANSFERT_BONUS';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
} ){
    switch (opt.type) {
      case 'TRANSFERT_MONEY':
        if(opt.action === 'REDIRECT'){
          this.appRouting.goToTransfertMoneyPage();
        }
        break;
      case 'TRANSFERT_CREDIT':
        if(opt.action === 'REDIRECT'){
          this.appRouting.goToTransfertCreditPage();
        }
        break;
      case 'TRANSFERT_BONUS':
        if(opt.action === 'REDIRECT'){
          this.appRouting.goToTransfertBonusPage();
        }
        break;
      default:
        break;
    }
}
}
