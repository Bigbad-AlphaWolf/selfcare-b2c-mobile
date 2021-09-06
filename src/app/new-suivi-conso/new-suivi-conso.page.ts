import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { ScrollVanishDirective } from '../directives/scroll-vanish/scroll-vanish.directive';
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

  constructor() {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.refreshData();
  }

  refreshData() {
    switch (this.currentSlideIndex) {
      case 0:
        this.consoPage.getUserConsoInfos();
        break;
      case 1:
        this.historicComPage.getPrepaidUserHistory();
        break;
      case 2:
        this.transactionHistoricPage.getTransactionsHistoric();
        break;
    }
  }

  setSlidesIndex(index) {
    this.sliders.slideTo(index);
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
