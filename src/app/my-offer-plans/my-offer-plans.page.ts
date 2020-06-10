import { Component, OnInit, ViewChild } from '@angular/core';
import { OfferPlansService } from '../services/offer-plans-service/offer-plans.service';
import { OfferPlan } from 'src/shared/models/offer-plan.model';
import { ApplicationRoutingService } from '../services/application-routing/application-routing.service';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { SubscriptionModel, BONS_PLANS } from 'src/shared';
import { HttpErrorResponse } from '@angular/common/http';
import { NavController, IonSlides } from '@ionic/angular';
import { getPageTitle } from '../utils/title.util';

@Component({
  selector: 'app-my-offer-plans',
  templateUrl: './my-offer-plans.page.html',
  styleUrls: ['./my-offer-plans.page.scss'],
})
export class MyOfferPlansPage implements OnInit {
  pageTitle: string;
  listCategories = [];
  categories = {
    illimix: 'Pass Illimix',
    internet: 'Pass internet',
    sargal: 'Sargal',
    autres: 'Autres',
    recharge: 'Recharge',
  };
  listOfferPlans: OfferPlan[] = [];
  isLoading: boolean;
  hasError: boolean;
  categorySelected: string;
  currentUserCodeFormule: string;
  payloadNavigation: { destinataire: string; code: string } = { destinataire: null, code: null };
  hasNoOfferPlans: boolean;
  fullList: { category: {label: string, value: string} , offersPlans: OfferPlan[] }[];
  @ViewChild('sliders') sliders: IonSlides;
  slideOpts = {
    speed: 400,
    slidesPerView: 1,
    slideShadows: true,
  };
  activeTabIndex = 0;

    constructor(
    private navController: NavController,
    private offerPlansServ: OfferPlansService,
    private appliRout: ApplicationRoutingService,
    private dashbServ: DashboardService,
    private authServ: AuthenticationService
  ) {}

  ngOnInit() {
    this.pageTitle = getPageTitle(BONS_PLANS).title;
    this.getUserOfferPlans();
    this.payloadNavigation.destinataire = this.dashbServ.getCurrentPhoneNumber();
    this.authServ.getSubscription(this.payloadNavigation.destinataire).subscribe((res: SubscriptionModel) => {
      this.payloadNavigation.code = res.code;
    });
  }

  goBack() {
    this.navController.navigateBack(['/dashboard']);
  }

  getUserOfferPlans() {
    this.isLoading = true;
    this.hasNoOfferPlans = false;
    this.hasError = false;
    this.offerPlansServ.getCurrentUserOfferPlans().subscribe(
      (response: OfferPlan[]) => {
        this.isLoading = false;
        this.hasError = false;
        if (response.length === 0) {
          this.hasNoOfferPlans = true;
        } else {
          this.hasNoOfferPlans = false;
          this.listOfferPlans = response;
          this.initCategoriesOfferPlan();
          this.arrangeOfferPlansByCategory(response, this.listCategories);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        if (err.status === 400) {
          this.hasNoOfferPlans = true;
        } else {
          this.hasError = true;
        }
      }
    );
  }

  initCategoriesOfferPlan() {
    let cats = [];
    this.listCategories = this.listOfferPlans
      .filter((op: OfferPlan) => {
        if (!cats.includes(op.typeMPO)) {
          cats.push(op.typeMPO);
          return true;
        } else return false;
      })
      .map((op: OfferPlan) => {
        return { label: this.categories[op.typeMPO.toLowerCase()], value: op.typeMPO };
      });
  }

  arrangeOfferPlansByCategory(listOffer: OfferPlan[], listCategories: {label: string, value: string}[]) {
    this.fullList = listCategories.map((category: {label: string, value: string})=> {
      const value = { category, offersPlans: [] };      
      value.offersPlans = listOffer.filter((offerPlanUncategorized)=>{        
        return offerPlanUncategorized.typeMPO.toLowerCase() === category.value.toLowerCase()
      })
      return value
    })
    console.log(this.fullList);
    
  }

  changeCategory(tabIndex: number) {
    this.sliders.slideTo(tabIndex);
    this.activeTabIndex = tabIndex;
  }

  slideChanged() {
    this.sliders.getActiveIndex().then((index) => {
      this.activeTabIndex = index;
    });
  }

  goToPage(category: string) {
    switch (category) {
      case 'illimix':
        this.appliRout.goToListPassIllimix(this.payloadNavigation);
        break;
      case 'internet':
        this.appliRout.goToListPassInternet(this.payloadNavigation);
        break;
      case 'recharge':
        this.appliRout.goToTransfertHubServicesPage('BUY');
        break;
      default:
        break;
    }
  }
}
