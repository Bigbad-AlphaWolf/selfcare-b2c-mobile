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
import { OemLoggingService } from '../services/oem-logging/oem-logging.service';

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
    private oemLoggingService: OemLoggingService
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.isIos = this.platform.is('ios');
    });
    this.dashboardService.listenToMenuClick().subscribe((menuItem) => {
      switch (menuItem) {
        case CONSO:
          this.setSlide(1, true);
          break;
        case SERVICES:
          this.setSlide(2, true);
          break;
        case ASSISTANCE:
          this.setSlide(3, true);
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

  setSlide(index, isFromMenu?: boolean) {
    this.currentSlideIndex = index;
    this.swiper.swiperRef.slideTo(index);
    this.refreshData();
    let eventName;
    switch (index) {
      case 0:
        eventName = isFromMenu
          ? 'sidemenu_dashboard_click'
          : 'dashboard_tabbar_accueil';
        break;
      case 1:
        eventName = isFromMenu
          ? 'sidemenu_details_conso'
          : 'dashboard_tabbar_conso';
        break;
      case 2:
        eventName = isFromMenu
          ? 'sidemenu_services_click'
          : 'dashboard_tabbar_services	';
        break;
      case 3:
        eventName = isFromMenu
          ? 'sidemenu_assistance_click'
          : 'dashboard_tabbar_assistance';
        break;
    }
    this.oemLoggingService.registerEvent(eventName, [
      {
        dataName: 'msisdn',
        dataValue: this.dashboardService.getCurrentPhoneNumber(),
      },
    ]);
  }

  onSwipe(event) {
    this.currentSlideIndex = event.activeIndex;
    this.ref.detectChanges();
    this.refreshData();
  }
}
