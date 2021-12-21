import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ASSISTANCE, CONSO, SERVICES } from 'src/shared';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { NewAssistanceHubV2Page } from '../new-assistance-hub-v2/new-assistance-hub-v2.page';
import { NewServicesPage } from '../new-services/new-services.page';
import { NewSuiviConsoPage } from '../new-suivi-conso/new-suivi-conso.page';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { BatchAnalyticsService } from '../services/batch-analytics/batch-analytics.service';

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
  @ViewChild('swiper', { static: false })
  swiper: SwiperComponent;
  @ViewChild(DashboardHomeComponent) dashboarHome: DashboardHomeComponent;
  @ViewChild(NewSuiviConsoPage) newSuiviConsoPage: NewSuiviConsoPage;
  @ViewChild(NewServicesPage) newServicesPage: NewServicesPage;
  @ViewChild(NewAssistanceHubV2Page) newAssistancePage: NewAssistanceHubV2Page;
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
  };
  isIos: boolean;

  constructor(
    private ref: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private platform: Platform,
    private batch: BatchAnalyticsService
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.isIos = this.platform.is('ios');
    });
    this.dashboardService.listenToMenuClick().subscribe((menuItem) => {
      console.log(menuItem);
      switch (menuItem) {
        case CONSO:
          this.setSlide(1);
          break;
        case SERVICES:
          this.setSlide(2);
          break;
        case ASSISTANCE:
          this.setSlide(3);
          break;
        default:
          break;
      }
    });
  }

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

  registerClicAction() {
    switch (this.currentSlideIndex) {
      case 0:
        this.batch.registerTag('click', 'click_dashboard_page');
        this.batch.registerEvent('see_dashboard_page');
        break;
      case 1:
        this.batch.registerTag('click', 'click_conso_page');
        this.batch.registerEvent('see_conso_page');
        break;
      case 2:
        this.batch.registerTag('click', 'click_services_page');
        this.batch.registerEvent('see_services_page');
        break;
      case 3:
        this.batch.registerTag('click', 'click_assistance_page');
        this.batch.registerEvent('see_assistance_page');
        break;
    }
  }

  setSlide(index) {
    this.currentSlideIndex = index;
    this.swiper.swiperRef.slideTo(index);
    this.refreshData();
    this.registerClicAction();
  }

  onSwipe(event) {
    this.currentSlideIndex = event.activeIndex;
    this.ref.detectChanges();
    this.refreshData();
  }
}
