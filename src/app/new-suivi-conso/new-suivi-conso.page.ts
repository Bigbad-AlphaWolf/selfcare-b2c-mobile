import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides, Platform } from '@ionic/angular';
import { ScrollVanishDirective } from '../directives/scroll-vanish/scroll-vanish.directive';
import { DemandeAnnulationTransfertModel } from '../models/demande-annulation-transfert.model';
import { CommunicationHistoricComponent } from './pages/communication-historic/communication-historic.component';
import { InternetHistoricComponent } from './pages/internet-historic/internet-historic.component';
import { NewDetailsConsoComponent } from './pages/new-details-conso/new-details-conso.component';
import { TransactionsHistoricComponent } from './pages/transactions-historic/transactions-historic.component';

export const enum CONSO_TABS {
	CONSO = 'CONSO', COMMUNICATIONS = 'COMMUNICATIONS', INTERNET = 'INTERNET', TRANSACTIONS = 'TRANSACTIONS'
}
@Component({
  selector: 'app-new-suivi-conso',
  templateUrl: './new-suivi-conso.page.html',
  styleUrls: ['./new-suivi-conso.page.scss'],
})
export class NewSuiviConsoPage implements OnInit {
  tabs = [
    { label: 'Conso' },
    { label: 'Communications' },
    { label: 'Internet' },
    { label: 'Transactions' },
  ];
  currentSlideIndex = 0;
  slideOpts = {
    speed: 400,
    slideShadows: true,
    spaceBetween: 20,
  };
  @ViewChild('slides') sliders: IonSlides;
  @ViewChildren(ScrollVanishDirective) dir;
  @ViewChild(NewDetailsConsoComponent) consoPage: NewDetailsConsoComponent;
  @ViewChild(CommunicationHistoricComponent)
  historicComPage: CommunicationHistoricComponent;
  @ViewChild(InternetHistoricComponent)
  historicInternet: InternetHistoricComponent;
  @ViewChild(TransactionsHistoricComponent)
  transactionHistoricPage: TransactionsHistoricComponent;
  @ViewChild('searchIcon') iconToggleSearch;
  isIos: boolean;
	listAnnulationTrx: DemandeAnnulationTransfertModel[] = [];
  constructor(private platform: Platform) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.isIos = this.platform.is('ios');
    });
  }

  ionViewWillEnter(event?) {
    console.log('exec');
    this.refreshData(event);
  }

  refreshData(event?) {
    switch (this.currentSlideIndex) {
      case 0:
        this.consoPage.getUserConsoInfos(event);
        break;
      case 1:
        this.historicComPage.getPrepaidUserHistory(event);
        break;
      case 2:
        this.historicInternet.getConsoData();
        break;
      case 3:
        this.transactionHistoricPage.getTransactionsHistoric(event);
        this.transactionHistoricPage.fetchAnnulationTrx();
        break;
    }
  }

  setSlidesIndex(index) {
    this.sliders.slideTo(index);
    // this.refreshData();
  }

  getCurrentSlide() {
    this.sliders.getActiveIndex().then((index) => {
      this.currentSlideIndex = index;
      // this.refreshData();
    });
  }

  search() {
    this.dir.first.show();
  }
}
