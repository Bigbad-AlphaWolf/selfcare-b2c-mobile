import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides, Platform } from '@ionic/angular';
import { ScrollVanishDirective } from '../directives/scroll-vanish/scroll-vanish.directive';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';
import { CommunicationHistoricComponent } from './pages/communication-historic/communication-historic.component';
import { NewDetailsConsoComponent } from './pages/new-details-conso/new-details-conso.component';
import { TransactionsHistoricComponent } from './pages/transactions-historic/transactions-historic.component';

@Component({
  selector: 'app-new-suivi-conso',
  templateUrl: './new-suivi-conso.page.html',
  styleUrls: ['./new-suivi-conso.page.scss'],
})
export class NewSuiviConsoPage implements OnInit {
  tabs = [
    { label: 'Conso' },
    { label: 'Communications' },
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
  @ViewChild(TransactionsHistoricComponent)
  transactionHistoricPage: TransactionsHistoricComponent;
  @ViewChild('searchIcon') iconToggleSearch;
  isIos: boolean;

  constructor(
    private platform: Platform,
    private oemLoggingService: OemLoggingService,
    private dashboardService: DashboardService
  ) {}

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
        this.transactionHistoricPage.getTransactionsHistoric(event);
        break;
    }
  }

  setSlidesIndex(index) {
    this.sliders.slideTo(index);
    let event = '';
    switch (index) {
      case 0:
        event = 'conso_details_click';
        break;
      case 1:
        event = 'conso_communications_click';
        break;
      case 2:
        event = 'conso_internet_click';
        break;
      case 3:
        event = 'conso_transactions_click';
        break;
    }
    this.oemLoggingService.registerEvent(event, [
      {
        dataName: 'msisdn',
        dataValue: this.dashboardService.getCurrentPhoneNumber(),
      },
    ]);
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
