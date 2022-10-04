import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ASSISTANCE, CONSO, HUB_OM_TAB, SERVICES } from 'src/shared';
import { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
import { NewAssistanceHubV2Page } from '../new-assistance-hub-v2/new-assistance-hub-v2.page';
import { NewServicesPage, TABS_SERVICES } from '../new-services/new-services.page';
import { NewSuiviConsoPage } from '../new-suivi-conso/new-suivi-conso.page';
import { OmUniverseComponent } from '../om-universe/om-universe.component';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
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
      defaultIcon: 'swap-horizontal-outline',
      activeIcon: 'swap-horizontal',
      label: 'O.M',
      route: 'om-hub',
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
  @ViewChild(OmUniverseComponent) omUniversPage: OmUniverseComponent;
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
  };
  isIos: boolean;

  constructor(
    private ref: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private platform: Platform
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
        case HUB_OM_TAB:
          this.setSlide(2);
          break;
        case SERVICES:
          this.setSlide(3);
          break;
        case ASSISTANCE:
          this.setSlide(4);
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
        this.omUniversPage.ionViewWillEnter();
        break;
      case 3:
        this.newServicesPage.ionViewWillEnter();
        break;
      case 4:
        this.newAssistancePage.ionViewWillEnter();
        break;
    }
  }

  setSlide(index) {
    this.currentSlideIndex = index;
    this.swiper.swiperRef.slideTo(index);
  }

	goTo(event: any) {
		console.log('event', event);
		const index = event.slideTo;
		const tab = event.tab;
		this.setSlide(index);
		console.log('tab', tab);

		if(tab === TABS_SERVICES.LOISIR) {
			this.newServicesPage.setSlidesIndex(Object.keys(TABS_SERVICES).indexOf(TABS_SERVICES.LOISIR));
		}
	}

  onSwipe(event) {
    this.currentSlideIndex = event.activeIndex;
    this.ref.detectChanges();
    this.refreshData();
  }
}
