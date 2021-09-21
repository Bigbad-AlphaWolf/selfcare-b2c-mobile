import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { NewAssistanceHubV2Page } from '../new-assistance-hub-v2/new-assistance-hub-v2.page';
import { NewServicesPage } from '../new-services/new-services.page';
import { NewSuiviConsoPage } from '../new-suivi-conso/new-suivi-conso.page';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';

@Component({
  selector: 'app-new-prepaid-hybrid-dashboard',
  templateUrl: './new-prepaid-hybrid-dashboard.page.html',
  styleUrls: ['./new-prepaid-hybrid-dashboard.page.scss'],
})
export class NewPrepaidHybridDashboardPage implements OnInit {
  tabs = [
    {
      defaultIcon: 'home-outline',
      activeIcon: 'home',
      label: 'Accueil',
      route: 'dashboard-home',
    },
    {
      defaultIcon: 'pie-chart-outline',
      activeIcon: 'pie-chart',
      label: 'Conso',
      route: 'suivi-conso',
    },
    {
      defaultIcon: 'bag-outline',
      activeIcon: 'bag',
      label: 'Services',
      route: 'my-services',
    },
    {
      defaultIcon: 'help-buoy-outline',
      activeIcon: 'help-buoy',
      label: 'Assistance',
      route: 'assistance',
    },
  ];
  currentSlideIndex = 0;
  @ViewChild('swiper', { static: false }) swiper: SwiperComponent;
  @ViewChild(DashboardHomeComponent) dashboarHome: DashboardHomeComponent;
  @ViewChild(NewSuiviConsoPage) newSuiviConsoPage: NewSuiviConsoPage;
  @ViewChild(NewServicesPage) newServicesPage: NewServicesPage;
  @ViewChild(NewAssistanceHubV2Page) newAssistancePage: NewAssistanceHubV2Page;
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
  };
  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.refreshData();
  }

  refreshData() {
    switch (this.currentSlideIndex) {
      case 0:
        this.dashboarHome.ionViewWillEnter();
        break;
      case 1:
        this.newSuiviConsoPage.ionViewWillEnter();
        break;
      case 2:
        this.newServicesPage.ionViewWillEnter();
        break;
      case 3:
        this.newAssistancePage.ionViewWillEnter();
        break;
    }
  }

  setSlide(index) {
    this.currentSlideIndex = index;
    this.swiper.swiperRef.slideTo(index);
    this.refreshData();
  }

  onSwipe(event) {
    this.currentSlideIndex = event.activeIndex;
    this.ref.detectChanges();
    this.refreshData();
  }
}
